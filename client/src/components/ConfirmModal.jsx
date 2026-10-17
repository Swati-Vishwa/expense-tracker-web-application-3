export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-[#EBE6D8] bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-[#1A1A1A]">{title}</h3>
        <p className="mt-2 text-sm text-[#1A1A1A]/70">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border border-[#EBE6D8] px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#FBF9F1]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-[#E87CA6] px-4 py-2 text-sm font-medium text-[#1A1A1A] hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}