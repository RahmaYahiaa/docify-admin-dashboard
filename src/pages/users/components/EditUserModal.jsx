import { useEffect, useState } from "react";
import { X, Info } from "lucide-react";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
];

function resolveName(user) {
  if (user?.user?.name) return user.user.name;
  if (user?.first_name || user?.last_name)
    return `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
  return user?.name || "";
}

function resolveEmail(user) {
  return user?.contact?.email ?? user?.email ?? "";
}

function resolvePhone(user) {
  return user?.contact?.phone ?? user?.phone ?? "";
}

function resolveStatus(user) {
  return (user?.status || "active").toLowerCase();
}

function splitName(fullName) {
  const parts = (fullName || "").trim().split(/\s+/);
  return { firstName: parts[0] || "", lastName: parts.slice(1).join(" ") };
}

export default function EditUserModal({
  user,
  onClose,
  onSave,
  loading = false,
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("active");

  useEffect(() => {
    if (!user) return;

    const { firstName: fn, lastName: ln } = splitName(resolveName(user));
    setFirstName(fn);
    setLastName(ln);
    setEmail(resolveEmail(user));
    setPhone(resolvePhone(user));
    setStatus(resolveStatus(user));
  }, [user]);

  const handleSave = () => {
    if (!firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      status,
    };

    onSave(user.id, payload);
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
            <p className="text-xs text-slate-400">ID: {user?.id}</p>
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
          {/* Basic Info */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Phone
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
            <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              User role cannot be changed after account creation.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[#E5E5E5]">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-700 border border-[#E5E5E5] rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3] disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
