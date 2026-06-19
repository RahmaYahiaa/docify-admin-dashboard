import { useState } from "react";
import { X, CheckCircle, Info } from "lucide-react";

export default function ActivateModal({
  user,
  reasons = [],
  onClose,
  onConfirm,
  loading = false,
}) {
  const [selected, setSelected] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] w-[480px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 bg-green-500 rounded-t-[10px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Activate Account
              </h2>
              <p className="text-xs text-green-100">
                User will regain full access
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">USER</p>
              <p className="text-sm font-semibold text-slate-900">
                {user.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">ROLE</p>
              <p className="text-sm font-semibold text-slate-900 capitalize">
                {user.role}
              </p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-[10px] px-4 py-3 space-y-2">
            <div className="flex items-center gap-2">
              <Info size={15} className="text-green-600 shrink-0" />
              <span className="text-sm font-medium text-green-700">
                Important
              </span>
            </div>
            {[
              "User will regain full platform access",
              "All features will be restored",
              "User can log in immediately",
              "This action will be logged",
            ].map((item, i) => (
              <p key={i} className="text-sm text-green-600 ml-5">
                • {item}
              </p>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">
              Reason <span className="text-red-500">*</span>
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {reasons.map((reason) => (
                <button
                  key={reason.key}
                  onClick={() => setSelected(reason.key)}
                  className={`w-full text-left px-4 py-2.5 text-sm rounded-lg border transition-colors ${
                    selected === reason.key
                      ? "border-green-400 bg-green-50 text-green-700"
                      : "border-[#E5E5E5] text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {reason.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-[10px] px-4 py-3">
            <Info size={15} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-700">
              This action will be recorded in the audit log with your admin ID,
              timestamp, and reason.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 border border-[#E5E5E5] rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(selected)}
              disabled={!selected || loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Confirm Activation"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}