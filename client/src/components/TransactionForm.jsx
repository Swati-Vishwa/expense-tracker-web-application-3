import { useState } from "react";
import { addTransaction, updateTransaction, getErrorMessage } from "../services/api";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../utils/constants";
import { toInputDate, todayInput } from "../utils/format";
import Alert from "./Alert";

const inputClass =
  "w-full rounded-md border border-[#EBE6D8] bg-white px-3 py-2 text-sm text-[#1A1A1A] outline-none focus:border-[#E87CA6] focus:ring-2 focus:ring-[#E87CA6]/30";

const errorClass =
  "mt-1 inline-block rounded bg-[#EAA4C1]/40 px-2 py-0.5 text-xs font-medium text-[#1A1A1A]";

export default function TransactionForm({ transaction, onClose, onSaved }) {
  const isEdit = Boolean(transaction);
  const [form, setForm] = useState({
    type: transaction?.type ?? "expense",
    amount: transaction?.amount ?? "",
    category: transaction?.category ?? "",
    description: transaction?.description ?? "",
    date: transaction ? toInputDate(transaction.date) : todayInput(),
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  const categories = form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const setType = (type) => {
    setForm((prev) => ({ ...prev, type, category: "" }));
    setErrors((prev) => ({ ...prev, category: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.amount || Number(form.amount) <= 0) e.amount = "Enter an amount greater than 0";
    if (!form.category) e.category = "Choose a category";
    if (!form.date) e.date = "Choose a date";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError("");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    const payload = {
      type: form.type,
      amount: Number(form.amount),
      category: form.category,
      description: form.description.trim(),
      date: form.date,
    };

    try {
      setSaving(true);
      if (isEdit) await updateTransaction(transaction._id, payload);
      else await addTransaction(payload);
      onSaved(isEdit ? "Transaction updated." : "Transaction added.");
    } catch (err) {
      setServerError(getErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#1A1A1A]/50 px-4 py-10">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-[#1A1A1A]">
          {isEdit ? "Edit Transaction" : "Add Transaction"}
        </h2>
        <Alert message={serverError} />

        <form onSubmit={handleSubmit} noValidate className="mt-4 grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            {["expense", "income"].map((t) => {
              const selected = form.type === t;
              const selectedStyle =
                t === "income"
                  ? "border-[#A9B67C] bg-[#A9B67C] text-[#1A1A1A]"
                  : "border-[#EAA4C1] bg-[#EAA4C1] text-[#1A1A1A]";
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`rounded-md border px-3 py-2 text-sm font-medium capitalize text-[#1A1A1A] ${selected ? selectedStyle : "border-[#EBE6D8] hover:bg-[#FBF9F1]"
                    }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <div>
            <label htmlFor="amount" className="mb-1 block text-sm font-medium text-[#1A1A1A]">Amount</label>
            <input
              id="amount" name="amount" type="number" step="0.01" min="0"
              value={form.amount} onChange={handleChange} placeholder="0.00"
              className={inputClass}
            />
            {errors.amount && <p className={errorClass}>{errors.amount}</p>}
          </div>

          <div>
            <label htmlFor="category" className="mb-1 block text-sm font-medium text-[#1A1A1A]">Category</label>
            <select
              id="category" name="category" value={form.category}
              onChange={handleChange} className={inputClass}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className={errorClass}>{errors.category}</p>}
          </div>

          <div>
            <label htmlFor="date" className="mb-1 block text-sm font-medium text-[#1A1A1A]">Date</label>
            <input
              id="date" name="date" type="date" value={form.date}
              onChange={handleChange} className={inputClass}
            />
            {errors.date && <p className={errorClass}>{errors.date}</p>}
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-[#1A1A1A]">
              Description <span className="text-[#1A1A1A]/50">(optional)</span>
            </label>
            <input
              id="description" name="description" value={form.description}
              onChange={handleChange} placeholder="e.g. Lunch with friends"
              className={inputClass}
            />
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button" onClick={onClose}
              className="rounded-md border border-[#EBE6D8] px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#FBF9F1]"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={saving}
              className="rounded-md bg-[#1A1A1A] px-5 py-2 text-sm font-medium text-[#FBF9F1] hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Saving..." : isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}