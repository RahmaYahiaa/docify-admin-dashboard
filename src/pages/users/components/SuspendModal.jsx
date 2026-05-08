import { useState } from "react";
import { X, AlertTriangle, Info } from "lucide-react";

export default function SuspendModal({
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
        <div className="flex items-center justify-between px-5 py-4 bg-red-500 rounded-t-[10px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <X size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Suspend Account
              </h2>
              <p className="text-xs text-red-100">
                User will lose access immediately
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
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

          <div className="bg-red-50 border border-red-200 rounded-[10px] px-4 py-3 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-red-500 shrink-0" />
              <span className="text-sm font-medium text-red-700">
                Important
              </span>
            </div>
            {[
              "User will be logged out immediately",
              "All active sessions will be terminated",
              "User will not be able to log in",
              "This action will be logged",
            ].map((item, i) => (
              <p key={i} className="text-sm text-red-600 ml-5">
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
                      ? "border-red-400 bg-red-50 text-red-700"
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
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Confirm Suspension"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
