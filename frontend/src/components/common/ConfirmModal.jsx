import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({ title, description, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={onCancel}
        className="absolute right-5 top-5 rounded-full p-2 text-slate-400 transition hover:text-slate-700 dark:hover:text-white"
      >
        <X size={18} />
      </button>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
        <AlertTriangle size={22} className="text-rose-500" />
      </div>
      <h3 className="mt-5 font-display text-2xl text-ink dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
      <div className="mt-8 flex gap-3">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Annuler
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
