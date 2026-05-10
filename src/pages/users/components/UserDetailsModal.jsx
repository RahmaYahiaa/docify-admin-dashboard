import { X, User, Stethoscope, Shield, Clock, Edit } from "lucide-react";

import StatusBadge from "@/components/shared/StatusBadge";
import RoleBadge from "@/components/shared/RoleBadge";

// normalize roles
const normalizeRole = (role = "") => role.toLowerCase().replace(/[_\s]+/g, "");

const isRole = (userRole, ...roles) =>
  roles.some((r) => normalizeRole(r) === normalizeRole(userRole));

// reusable field
function Field({ label, value, colSpan = 1, blue = false }) {
  const bg = blue ? "bg-blue-50" : "bg-slate-50";

  const lbCls = blue ? "text-blue-400" : "text-slate-400";

  const valCls = blue ? "text-blue-700" : "text-slate-900";

  return (
    <div
      className={`${bg} rounded-lg p-3 ${colSpan === 2 ? "col-span-2" : ""}`}
    >
      <p className={`text-xs ${lbCls} mb-1 uppercase tracking-wide`}>{label}</p>

      <p className={`text-sm font-medium ${valCls} break-all`}>
        {value || <span className="italic text-slate-300">—</span>}
      </p>
    </div>
  );
}

export default function UserDetailsModal({ user, onClose, onEdit }) {
  const isDoctor = isRole(user.role, "doctor");

  const isAdmin = isRole(user.role, "admin", "super admin");

  const isAssistant = isRole(user.role, "assistant");

  // FULL NAME
  const fullName =
    user.name ||
    `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
    "—";

  // SPECIALIZATION
  const specialty =
    user.specialty ||
    user.specialization?.name ||
    user.specialization_name ||
    "—";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900">
                User Details
              </h2>

              <RoleBadge role={user.role} />
            </div>

            <p className="text-xs text-slate-400 mt-0.5">ID: {user.id}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(user);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3] transition-colors"
            >
              <Edit size={13} />
              Edit
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          {/* BASIC INFO */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <User size={14} className="text-slate-500" />

              <h3 className="text-sm font-semibold text-slate-900">
                Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Full Name" value={fullName} />

              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide">
                  Status
                </p>

                <StatusBadge status={user.status} />
              </div>

              <Field label="Email" value={user.email} />

              <Field label="Phone" value={user.phone} />
            </div>
          </section>

          {/* DOCTOR */}
          {isDoctor && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope size={14} className="text-blue-500" />

                <h3 className="text-sm font-semibold text-blue-700">
                  Doctor Information
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Specialty"
                  value={user.specialty || user.specialization_name || "—"}
                  blue
                />
              </div>
            </section>
          )}

          {/* ADMIN */}
          {isAdmin && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} className="text-purple-500" />

                <h3 className="text-sm font-semibold text-purple-700">
                  Admin Information
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-purple-400 mb-1 uppercase tracking-wide">
                    Admin Level
                  </p>

                  <p className="text-sm font-medium text-purple-700 capitalize">
                    {user.adminLevel || user.role || "—"}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* ASSISTANT */}
          {isAssistant && <section />}

          {/* ACTIVITY */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} className="text-slate-500" />

              <h3 className="text-sm font-semibold text-slate-900">
                Activity & Audit
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Last Login" value={user.lastLogin} />

              <Field label="Account Created" value={user.accountCreated} />

              <Field label="Created By" value={user.createdBy} colSpan={2} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
