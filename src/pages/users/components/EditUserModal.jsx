import { useState } from "react";
import { X, Info } from "lucide-react";

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
  { label: "Blocked", value: "blocked" },
];

export default function EditUserModal({
  user,
  onClose,
  onSave,
  loading = false,
}) {
  const role = user.role?.toLowerCase();

  const [form, setForm] = useState({
    // Basic
    first_name: user.name?.split(" ")[0] || "",
    last_name: user.name?.split(" ").slice(1).join(" ") || "",
    email: user.email || "",
    phone: user.phone || "",
    status: user.status?.toLowerCase() || "active",
    // Doctor extras
    specialty: user.specialty || "",
    licenseNumber: user.licenseNumber || "",
    // Admin extras
    adminLevel: user.adminLevel || "",
    // linkedDoctor: user.linkedDoctor || "",
  });

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = () => {
    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      status: form.status,
      // Only send specialty if it's a doctor
      ...(role === "doctor" && form.specialty && { specialty: form.specialty }),
    };
    onSave({ id: user.id, data: payload });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5E5E5]">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Edit User
            </h2>
            <p className="text-xs text-slate-400">ID: {user.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* ── Basic Info ── */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Basic Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.first_name}
                  onChange={set("first_name")}
                  className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Last Name
                </label>
                <input
                  value={form.last_name}
                  onChange={set("last_name")}
                  className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                value={form.email}
                onChange={set("email")}
                className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Phone
              </label>
              <input
                value={form.phone}
                onChange={set("phone")}
                className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Account Status
              </label>
              <select
                value={form.status}
                onChange={set("status")}
                className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] bg-white transition-colors"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* ── Doctor-specific ── */}
          {role === "doctor" && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Doctor Information
              </h3>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Specialty
                </label>
                <input
                  value={form.specialty}
                  onChange={set("specialty")}
                  placeholder="e.g. Cardiology"
                  className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
                />
              </div>

              {/*
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">License Number</label>
                <input
                  value={form.licenseNumber}
                  onChange={set("licenseNumber")}
                  placeholder="Enter license number"
                  className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC]"
                />
              </div>
              */}
            </section>
          )}

          {/* ── Admin-specific ── */}
          {(role === "admin" || role === "super admin") && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Admin Information
              </h3>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Admin Level
                </label>

                <input
                  value={form.adminLevel}
                  onChange={set("adminLevel")}
                  placeholder="admin / super admin"
                  disabled
                  className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none bg-slate-50 text-slate-400 cursor-not-allowed"
                />
                <p className="text-xs text-slate-400">
                  Admin level cannot be changed after creation.
                </p>
              </div>
            </section>
          )}
          {/*
          {role === "assistant" && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">Assistant Information</h3>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Linked Doctor</label>
                <input
                  value={form.linkedDoctor}
                  onChange={set("linkedDoctor")}
                  className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC]"
                />
              </div>
            </section>
          )}
          */}

          {/* Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
            <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              User role cannot be changed after account creation. To manage
              permissions use the Roles &amp; Permissions section.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[#E5E5E5]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 border border-[#E5E5E5] rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
