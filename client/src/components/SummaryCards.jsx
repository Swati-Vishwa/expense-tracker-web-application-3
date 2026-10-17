import { formatCurrency } from "../utils/format";

const cards = [
  { key: "balance", label: "Balance", bg: "bg-[#A2B5E2]" },
  { key: "income", label: "Total Income", bg: "bg-[#A9B67C]" },
  { key: "expense", label: "Total Expenses", bg: "bg-[#EAA4C1]" },
];

export default function SummaryCards({ summary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div key={c.key} className={`rounded-xl border border-[#EBE6D8] p-5 shadow-sm ${c.bg}`}>
          <p className="text-sm text-[#1A1A1A]/70">{c.label}</p>
          <p className="mt-2 text-2xl font-bold text-[#1A1A1A]">
            {formatCurrency(summary?.[c.key])}
          </p>
        </div>
      ))}
    </div>
  );
}