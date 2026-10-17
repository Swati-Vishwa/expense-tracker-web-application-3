import { useEffect, useState } from "react";
import { getSummary, getErrorMessage } from "../services/api";
import { formatCurrency } from "../utils/format";
import SummaryCards from "../components/SummaryCards";
import { ExpensePieChart, MonthlyBarChart } from "../components/Charts";
import Alert from "../components/Alert";

const inputClass =
  "rounded-md border border-[#EBE6D8] bg-white px-3 py-2 text-sm text-[#1A1A1A] outline-none focus:border-[#E87CA6] focus:ring-2 focus:ring-[#E87CA6]/30";

export default function Reports() {
  const [range, setRange] = useState({ startDate: "", endDate: "" });
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const { data } = await getSummary(range);
        if (!ignore) {
          setSummary(data.data);
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
  }, [range]);

  const handleChange = (e) => setRange({ ...range, [e.target.name]: e.target.value });

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Reports</h1>
          <p className="text-sm text-[#1A1A1A]/60">
            {range.startDate || range.endDate ? "Filtered period" : "All time"}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs text-[#1A1A1A]/60">
            From
            <input type="date" name="startDate" value={range.startDate}
              max={range.endDate || undefined} onChange={handleChange}
              className={`${inputClass} mt-1 block`} />
          </label>
          <label className="text-xs text-[#1A1A1A]/60">
            To
            <input type="date" name="endDate" value={range.endDate}
              min={range.startDate || undefined} onChange={handleChange}
              className={`${inputClass} mt-1 block`} />
          </label>
          {(range.startDate || range.endDate) && (
            <button
              onClick={() => setRange({ startDate: "", endDate: "" })}
              className="rounded-md border border-[#EBE6D8] px-3 py-2 text-sm text-[#1A1A1A] hover:bg-[#FBF9F1]"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <Alert message={error} />

      {loading || !summary ? (
        <p className="mt-10 text-center text-[#1A1A1A]/60">Loading...</p>
      ) : (
        <>
          <div className="mt-6">
            <SummaryCards summary={summary} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-[#EBE6D8] bg-white p-5 shadow-sm">
              <h2 className="mb-2 font-semibold text-[#1A1A1A]">Expenses by category</h2>
              <ExpensePieChart data={summary.byCategory} />
            </section>
            <section className="rounded-xl border border-[#EBE6D8] bg-white p-5 shadow-sm">
              <h2 className="mb-2 font-semibold text-[#1A1A1A]">Monthly income vs expenses</h2>
              <MonthlyBarChart data={summary.monthly} />
            </section>
          </div>

          {summary.byCategory.length > 0 && (
            <section className="mt-6 rounded-xl border border-[#EBE6D8] bg-white p-5 shadow-sm">
              <h2 className="mb-3 font-semibold text-[#1A1A1A]">Category breakdown</h2>
              <ul className="divide-y divide-[#EBE6D8] text-sm text-[#1A1A1A]">
                {summary.byCategory.map((c) => (
                  <li key={c.category} className="flex justify-between py-2">
                    <span>{c.category}</span>
                    <span className="font-medium">{formatCurrency(c.total)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </>
  );
}