import { formatCurrency, formatDate } from "../utils/format";

export default function TransactionTable({ transactions, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return <p className="py-10 text-center text-[#1A1A1A]/60">No transactions found.</p>;
  }
  const showActions = Boolean(onEdit && onDelete);

  return (
    <div className="overflow-x-auto rounded-lg border border-[#EBE6D8] bg-white">
      <table className="w-full text-left text-sm text-[#1A1A1A]">
        <thead className="bg-[#FBF9F1] text-[#1A1A1A]">
          <tr>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Description</th>
            <th className="px-4 py-3 text-right font-semibold">Amount</th>
            {showActions && <th className="px-4 py-3 text-right font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id} className="border-t border-[#EBE6D8] hover:bg-[#FBF9F1]">
              <td className="px-4 py-3 whitespace-nowrap">{formatDate(t.date)}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${t.type === "income" ? "bg-[#A9B67C]/40" : "bg-[#EAA4C1]/50"
                    }`}
                >
                  {t.category}
                </span>
              </td>
              <td className="px-4 py-3 text-[#1A1A1A]/70">{t.description || "—"}</td>
              <td className={`px-4 py-3 text-right font-semibold whitespace-nowrap ${t.type === "income" ? "text-[#92a060]" : "text-[#c94444]"}`}>                {t.type === "income" ? "+" : "-"}
                {formatCurrency(t.amount)}
              </td>
              {showActions && (
                <td className="space-x-2 px-4 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => onEdit(t)}
                    className="rounded bg-[#F3D883] px-2 py-1 text-xs font-medium text-[#1A1A1A] hover:opacity-80"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(t)}
                    className="rounded bg-[#EAA4C1]/60 px-2 py-1 text-xs font-medium text-[#1A1A1A] hover:opacity-80"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}