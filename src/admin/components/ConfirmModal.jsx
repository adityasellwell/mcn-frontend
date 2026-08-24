import { AlertTriangle, X } from "lucide-react";

// ─────────────────────────────────────────────
// Reusable "Are you sure?" confirmation modal
// Used before any destructive / hard-delete action
// ─────────────────────────────────────────────
const ConfirmModal = ({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  danger = true,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0f1b3d] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <span
              className={`flex items-center justify-center w-9 h-9 rounded-full ${
                danger
                  ? "bg-rose-500/10 text-rose-400"
                  : "bg-blue-500/10 text-blue-400"
              }`}
            >
              <AlertTriangle size={18} />
            </span>
            <h2 className="text-base font-semibold text-white">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-[#6b7ea3] hover:text-white hover:bg-white/10 transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          <p className="text-sm text-[#a8b8d4] leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center gap-3 p-5 border-t border-white/5">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-[#6b7ea3] hover:text-white transition disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-60 ${
              danger
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
