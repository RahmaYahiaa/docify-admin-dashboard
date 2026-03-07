import { useState } from "react";
import { X, Info, Mail } from "lucide-react";

export default function ResetPasswordModal({ user, onClose, onConfirm }) {
  const [method, setMethod] = useState("auto");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-orange-500 rounded-t-[10px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Info size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Reset Password
              </h2>
              <p className="text-xs text-orange-100">For {user.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Security Notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 space-y-1.5">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-orange-500 shrink-0" />
              <span className="text-sm font-medium text-orange-700">
                Security Notice
              </span>
            </div>
            {[
              "Old password will be invalidated immediately",
              "User will be required to change password on next login",
              "This action will be logged in the audit trail",
            ].map((item, i) => (
              <p key={i} className="text-sm text-orange-600 ml-5">
                • {item}
              </p>
            ))}
          </div>

          {/* Method Selection */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">
              Choose Password Method
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  id: "auto",
                  label: "Auto-generate",
                  desc: "System creates secure password",
                },
                {
                  id: "manual",
                  label: "Manual",
                  desc: "Set password yourself",
                },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className="p-3 rounded-lg border border-[#E5E5E5] bg-white text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {/* Radio Circle */}
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        method === m.id
                          ? "border-[#0066CC]"
                          : "border-slate-300"
                      }`}
                    >
                      {method === m.id && (
                        <div className="w-2 h-2 rounded-full bg-[#0066CC]" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-900">
                      {m.label}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 ml-6">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>
          {/* Email Notification */}
          <div className="flex items-center gap-3 p-3 border border-[#E5E5E5] rounded-lg">
            <Mail size={16} className="text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-700">
                Send email notification
              </p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
            <Info size={16} className="text-blue-500 shrink-0" />
            <p className="text-xs text-blue-700">
              A secure random password will be generated and sent to the user
              via email.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 border border-[#E5E5E5] rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(method)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
