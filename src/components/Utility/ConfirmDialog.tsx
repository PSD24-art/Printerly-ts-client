import { AlertTriangle, CircleAlert, Info, X } from "lucide-react";

export type DialogType = "confirm" | "alert" | "warning" | "danger";

interface ConfirmDialogProps {
  type: DialogType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  type,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const config = {
    confirm: {
      icon: AlertTriangle,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      button: "bg-indigo-600 hover:bg-indigo-700",
    },

    alert: {
      icon: Info,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
    },

    warning: {
      icon: AlertTriangle,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      button: "bg-amber-600 hover:bg-amber-700",
    },

    danger: {
      icon: CircleAlert,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      button: "bg-red-600 hover:bg-red-700",
    },
  };

  const current = config[type];
  const Icon = current.icon;

  const isAlert = type === "alert";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4">
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Content */}

        <div className="flex gap-4 p-5">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${current.iconBg} ${current.iconColor}`}
          >
            <Icon size={21} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>

            <p className="mt-1.5 text-sm leading-5 text-slate-500">{message}</p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="h-fit rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Actions */}

        <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3">
          {!isAlert && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${current.button}`}
          >
            {isAlert ? confirmText || "Okay" : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
