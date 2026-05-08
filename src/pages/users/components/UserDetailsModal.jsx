import {
  X,
  Mail,
  Phone,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Shield,
  Download,
  Edit,
} from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import RoleBadge from "@/components/shared/RoleBadge";

function InfoField({ label, value, colSpan = 1 }) {
  return (
    <div
      className={`bg-slate-50 rounded-lg p-3 ${colSpan === 2 ? "col-span-2" : ""}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-900 break-all">
        {value || <span className="text-slate-300 italic">—</span>}
      </p>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, color = "text-slate-700" }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={15} className={color} />
      <h3 className={`text-sm font-semibold ${color}`}>{title}</h3>
    </div>
  );
}

export default function UserDetailsModal({ user, onClose, onEdit }) {
  const isDoctor = user.role?.toLowerCase() === "doctor";
  const isAdmin = ["admin", "super admin"].includes(user.role?.toLowerCase());
  // const isAssistant = user.role?.toLowerCase() === "assistant";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/*  Header  */}
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

        {/* ── Body ── */}
        <div className="p-6 space-y-6">
          {/*  Basic Information (always shown) */}
          <section>
            <SectionHeader icon={User} title="Basic Information" />
            <div className="grid grid-cols-2 gap-3">
              <InfoField label="Full Name" value={user.name} />
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Status
                </p>
                <StatusBadge status={user.status} />
              </div>
              <InfoField label="Email" value={user.email} />
              <InfoField label="Phone" value={user.phone} />
            </div>
          </section>

          {/*  Doctor-specific block */}
          {isDoctor && (
            <section>
              <SectionHeader
                icon={Stethoscope}
                title="Doctor Information"
                color="text-blue-600"
              />
              <div className="grid grid-cols-2 gap-3">
                <InfoField label="Specialty" value={user.specialty} />

                {user.medicalCertificate ? (
                  <div className="col-span-2 bg-blue-50 rounded-lg p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 mb-2">
                      Medical Certificate
                    </p>
                    <a
                      href={user.medicalCertificate}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-sm text-[#0066CC] font-medium hover:underline"
                    >
                      <Download size={14} />
                      Download Certificate
                    </a>
                  </div>
                ) : (
                  // Show placeholder when no certificate uploaded yet
                  <div className="col-span-2 bg-blue-50 rounded-lg p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 mb-1">
                      Medical Certificate
                    </p>
                    <p className="text-sm text-slate-400 italic">
                      No certificate uploaded
                    </p>
                  </div>
                )}

                {/*
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 mb-1">Total Appointments</p>
                  <p className="text-2xl font-bold text-blue-700">{user.totalAppointments ?? "—"}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-blue-700">{user.completedAppointments ?? "—"}</p>
                </div>
                */}
              </div>
            </section>
          )}

          {/* Admin-specific block */}
          {isAdmin && (
            <section>
              <SectionHeader
                icon={Shield}
                title="Admin Information"
                color="text-purple-600"
              />
              <div className="grid grid-cols-2 gap-3">
                <InfoField label="Admin Level" value={user.adminLevel} />
              </div>
            </section>
          )}

          {/*  Assistant block */}
          {/*           
          {isAssistant && (
            <section>
              <SectionHeader icon={User} title="Assistant Information" />
              <div className="grid grid-cols-1 gap-3">
                <InfoField label="Linked Doctor" value={user.linkedDoctor} />
              </div>
            </section>
          )} */}

          {/* Activity & Audit */}
          <section>
            <SectionHeader icon={Clock} title="Activity & Audit" />
            <div className="grid grid-cols-2 gap-3">
              <InfoField label="Last Login" value={user.lastLogin} />
              <InfoField label="Account Created" value={user.accountCreated} />
              <InfoField
                label="Created By"
                value={user.createdBy}
                colSpan={2}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
