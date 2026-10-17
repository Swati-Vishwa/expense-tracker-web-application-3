export default function Alert({ type = "error", message, onClose }) {
  if (!message) return null;
  const styles =
    type === "success"
      ? "bg-[#A9B67C]/30 text-[#1A1A1A] border border-[#A9B67C]"
      : "bg-[#EAA4C1]/40 text-[#1A1A1A] border border-[#EAA4C1]";

  return (
    <div className={`mt-4 flex items-center justify-between rounded-md px-4 py-3 text-sm ${styles}`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss">✕</button>
      )}
    </div>
  );
}