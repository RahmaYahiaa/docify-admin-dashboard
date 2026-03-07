import { X, Download } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import RoleBadge from "@/components/shared/RoleBadge";

export default function UserDetailsModal({ user, onClose, onEdit }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-900">
                  User Details
                </h2>
                <RoleBadge role={user.role} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">ID: {user.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(user);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3] transition-colors"
            >
              Edit
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">FULL NAME</p>
                <p className="text-sm font-medium text-slate-900">
                  {user.name}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">STATUS</p>
                <StatusBadge status={user.status} />
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">EMAIL</p>
                <p className="text-sm font-medium text-slate-900">
                  {user.email}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">PHONE</p>
                <p className="text-sm font-medium text-slate-900">
                  {user.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Role Specific Info */}
          {user.role === "Doctor" && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Doctor Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-400 mb-1">SPECIALTY</p>
                  <p className="text-sm font-medium text-blue-700">
                    {user.specialty}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-400 mb-1">LICENSE NUMBER</p>
                  <p className="text-sm font-medium text-blue-700">
                    {user.licenseNumber}
                  </p>
                </div>
                {user.medicalCertificate && (
                  <div className="col-span-2 bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-400 mb-2">
                      MEDICAL CERTIFICATE
                    </p>
                    <button className="flex items-center gap-1.5 text-sm text-[#0066CC] font-medium">
                      <Download size={14} />
                      Download Certificate
                    </button>
                  </div>
                )}
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-400 mb-1">
                    TOTAL APPOINTMENTS
                  </p>
                  <p className="text-2xl font-bold text-blue-700">
                    {user.totalAppointments}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-400 mb-1">COMPLETED</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {user.completedAppointments}
                  </p>
                </div>
              </div>
            </div>
          )}

          {user.role === "Assistant" && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Assistant Information
              </h3>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">LINKED DOCTOR</p>
                <p className="text-sm font-medium text-slate-900">
                  {user.linkedDoctor}
                </p>
              </div>
            </div>
          )}

          {(user.role === "Admin" || user.role === "Super Admin") && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Admin Information
              </h3>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">ADMIN LEVEL</p>
                <p className="text-sm font-medium text-slate-900">
                  {user.adminLevel}
                </p>
              </div>
            </div>
          )}

          {/* Security & Activity */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Security & Activity
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">LAST LOGIN</p>
                <p className="text-sm font-medium text-slate-900">
                  {user.lastLogin}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">ACCOUNT CREATED</p>
                <p className="text-sm font-medium text-slate-900">
                  {user.accountCreated}
                </p>
              </div>
              <div className="col-span-2 bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">
                  PASSWORD INFORMATION
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {user.lastPasswordReset
                    ? `Last reset: ${user.lastPasswordReset}`
                    : "Never reset"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Passwords are never displayed for security reasons
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">CREATED BY</p>
                <p className="text-sm font-medium text-slate-900">
                  {user.createdBy}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
