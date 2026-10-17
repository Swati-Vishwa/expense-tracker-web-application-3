import { useEffect, useState } from "react";
import { getTransactions, deleteTransaction, getErrorMessage } from "../services/api";
import { ALL_CATEGORIES } from "../utils/constants";
import TransactionTable from "../components/TransactionTable";
import TransactionForm from "../components/TransactionForm";
import ConfirmModal from "../components/ConfirmModal";
import Alert from "../components/Alert";

const emptyFilters = { type: "", category: "", startDate: "", endDate: "" };
const inputClass =
  "rounded-md border border-[#EBE6D8] bg-white px-3 py-2 text-sm text-[#1A1A1A] outline-none focus:border-[#E87CA6] focus:ring-2 focus:ring-[#E87CA6]/30";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formState, setFormState] = useState(null); // null = closed, { transaction } = open
  const [toDelete, setToDelete] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const { data } = await getTransactions(filters);
        if (!ignore) {
          setTransactions(data.data);
          setError("");
        }
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err));
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [filters, refresh]);

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSaved = (message) => {
    setFormState(null);
    setSuccess(message);
    setRefresh((r) => r + 1);
  };

  const confirmDelete = async () => {
    try {
      await deleteTransaction(toDelete._id);
      setSuccess("Transaction deleted.");
      setRefresh((r) => r + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setToDelete(null);
    }
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Transactions</h1>
          <p className="text-sm text-[#1A1A1A]/60">{transactions.length} records shown</p>
        </div>
        <button
          onClick={() => setFormState({ transaction: null })}
          className="rounded-md bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-[#FBF9F1] hover:opacity-90"
        >
          + Add Transaction
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <select name="type" value={filters.type} onChange={handleFilter} className={inputClass}>
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select name="category" value={filters.category} onChange={handleFilter} className={inputClass}>
          <option value="">All categories</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <label className="text-xs text-[#1A1A1A]/60">
          From
          <input type="date" name="startDate" value={filters.startDate}
            max={filters.endDate || undefined} onChange={handleFilter}
            className={`${inputClass} mt-1 block`} />
        </label>
        <label className="text-xs text-[#1A1A1A]/60">
          To
          <input type="date" name="endDate" value={filters.endDate}
            min={filters.startDate || undefined} onChange={handleFilter}
            className={`${inputClass} mt-1 block`} />
        </label>
        {hasFilters && (
          <button
            onClick={() => setFilters(emptyFilters)}
            className="rounded-md border border-[#EBE6D8] px-3 py-2 text-sm text-[#1A1A1A] hover:bg-[#FBF9F1]"
          >
            Clear filters
          </button>
        )}
      </div>

      <Alert type="success" message={success} onClose={() => setSuccess("")} />
      <Alert message={error} />

      <div className="mt-4">
        {loading ? (
          <p className="mt-10 text-center text-[#1A1A1A]/60">Loading...</p>
        ) : (
          <TransactionTable
            transactions={transactions}
            onEdit={(t) => setFormState({ transaction: t })}
            onDelete={setToDelete}
          />
        )}
      </div>

      {formState && (
        <TransactionForm
          key={formState.transaction?._id ?? "new"}
          transaction={formState.transaction}
          onClose={() => setFormState(null)}
          onSaved={handleSaved}
        />
      )}

      <ConfirmModal
        open={Boolean(toDelete)}
        title="Delete transaction?"
        message="This will permanently remove this transaction."
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}