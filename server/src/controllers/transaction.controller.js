import {Transaction} from "../models/transaction.model.js";
import APIError from "../utils/API-Error.js";
import APIResponse from "../utils/API-Response.js";

const TYPES = ["income", "expense"];
const FIELDS = ["type", "amount", "category", "description", "date"];

const pick = (obj, keys) =>
  Object.fromEntries(keys.filter((k) => obj?.[k] !== undefined).map((k) => [k, obj[k]]));

const round2 = (n) => Math.round(n * 100) / 100;

const buildFilter = (userId, query) => {
  const { type, category, startDate, endDate } = query;
  const filter = { user: userId };

  if (type) {
    if (!TYPES.includes(type)) throw new APIError(400, "Type must be income or expense");
    filter.type = type;
  }
  if (category) {
    if (typeof category !== "string") throw new APIError(400, "Invalid category");
    filter.category = category;
  }

  const range = {};
  if (startDate) {
    const d = new Date(startDate);
    if (Number.isNaN(d.getTime())) throw new APIError(400, "Invalid start date");
    range.$gte = d;
  }
  if (endDate) {
    const d = new Date(endDate);
    if (Number.isNaN(d.getTime())) throw new APIError(400, "Invalid end date");
    d.setUTCHours(23, 59, 59, 999); 
    range.$lte = d;
  }
  if (startDate || endDate) filter.date = range;

  return filter;
};

export const createTransaction = async (req, res) => {
  const transaction = await Transaction.create({
    ...pick(req.body, FIELDS),
    user: req.user._id,
  });
  res.status(201).json(new APIResponse(201, transaction, "Transaction added"));
};

export const getTransactions = async (req, res) => {
  const filter = buildFilter(req.user._id, req.query);
  let query = Transaction.find(filter).sort({ date: -1, createdAt: -1 });

  const limit = Number.parseInt(req.query.limit, 10);
  if (limit > 0) query = query.limit(Math.min(limit, 500));

  const transactions = await query;
  res.json(new APIResponse(200, transactions, "Transactions fetched"));
};

export const updateTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    pick(req.body, FIELDS),
    { returnDocument: "after", runValidators: true }
  );
  if (!transaction) throw new APIError(404, "Transaction not found");
  res.json(new APIResponse(200, transaction, "Transaction updated"));
};

export const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!transaction) throw new APIError(404, "Transaction not found");
  res.json(new APIResponse(200, null, "Transaction deleted"));
};

export const getSummary = async (req, res) => {
  const filter = buildFilter(req.user._id, req.query);

  const [result] = await Transaction.aggregate([
    { $match: filter },
    {
      $facet: {
        totals: [{ $group: { _id: "$type", total: { $sum: "$amount" } } }],
        byCategory: [
          { $match: { type: "expense" } },
          { $group: { _id: "$category", total: { $sum: "$amount" } } },
          { $sort: { total: -1 } },
        ],
        monthly: [
          {
            $group: {
              _id: { year: { $year: "$date" }, month: { $month: "$date" }, type: "$type" },
              total: { $sum: "$amount" },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ],
      },
    },
  ]);

  let income = 0;
  let expense = 0;
  for (const t of result.totals) {
    if (t._id === "income") income = t.total;
    else expense = t.total;
  }

  const byCategory = result.byCategory.map((c) => ({
    category: c._id,
    total: round2(c.total),
  }));

  const months = new Map();
  for (const m of result.monthly) {
    const key = `${m._id.year}-${String(m._id.month).padStart(2, "0")}`;
    const row = months.get(key) ?? { month: key, income: 0, expense: 0 };
    row[m._id.type] = round2(m.total);
    months.set(key, row);
  }

  res.json(
    new APIResponse(
      200,
      {
        income: round2(income),
        expense: round2(expense),
        balance: round2(income - expense),
        byCategory,
        monthly: [...months.values()],
      },
      "Summary fetched"
    )
  );
};