import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSummary, getTransactions, getErrorMessage } from "../services/api";
import SummaryCards from "../components/SummaryCards";
import TransactionTable from "../components/TransactionTable";
import TransactionForm from "../components/TransactionForm";
import Alert from "../components/Alert";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const [s, t] = await Promise.all([getSummary(), getTransactions({ limit: 5 })]);
        if (!ignore) {
          setSummary(s.data.data);
          setRecent(t.data.data);
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
  }, [refresh]);

  const handleSaved = (message) => {
    setFormOpen(false);
    setSuccess(message);
    setRefresh((r) => r + 1);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">{getGreeting()}!</h1>
          <p className="text-sm text-[#1A1A1A]/60">Your all-time financial overview</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="rounded-md bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-[#FBF9F1] hover:opacity-90"
        >
          + Add Transaction
        </button>
      </div>

      <Alert type="success" message={success} onClose={() => setSuccess("")} />
      <Alert message={error} />

      {loading ? (
        <p className="mt-10 text-center text-[#1A1A1A]/60">Loading...</p>
      ) : (
        <>
          <div className="mt-6">
            <SummaryCards summary={summary} />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Recent transactions</h2>
            <Link to="/transactions" className="text-sm font-medium text-[#1A1A1A] underline underline-offset-4 hover:opacity-70">
              View all →
            </Link>
          </div>
          <div className="mt-3">
            <TransactionTable transactions={recent} />
          </div>
        </>
      )}

      {formOpen && (
        <TransactionForm key="new" onClose={() => setFormOpen(false)} onSaved={handleSaved} />
      )}
    </>
  );
}