import { useState } from "react";
import { X, Info } from "lucide-react";
import { toast } from "sonner";

export default function EditUserModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    specialty: user.specialty || "",
    licenseNumber: user.licenseNumber || "",
    linkedDoctor: user.linkedDoctor || "",
    adminLevel: user.adminLevel || "",
    status: user.status,
  });

  const handleSave = () => {
    if (!form.name.trim()) return toast.error("Name is required");
    onSave({ ...user, ...form });
    toast.success("User updated successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] w-full max-w-lg max-h-[90vh] overflow-y-auto">
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
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Basic Information
            </h3>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Account Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({ ...p, status: e.target.value }))
                }
                className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC]"
              >
                <option>Active</option>
                <option>Pending</option>
                <option>Suspended</option>
              </select>
            </div>
          </div>

          {/* Role Specific */}
          {user.role === "Doctor" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Doctor Information
              </h3>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Specialty
                </label>
                <input
                  value={form.specialty}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, specialty: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  License Number
                </label>
                <input
                  value={form.licenseNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, licenseNumber: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC]"
                />
              </div>
            </div>
          )}

          {user.role === "Assistant" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Assistant Information
              </h3>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Linked Doctor
                </label>
                <input
                  value={form.linkedDoctor}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, linkedDoctor: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC]"
                />
              </div>
            </div>
          )}

          {/* Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
            <Info size={16} className="text-blue-500 shrink-0" />
            <p className="text-xs text-blue-700">
              User role cannot be changed after account creation. To reset
              password or manage permissions, use the respective action buttons.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[#E5E5E5]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 border border-[#E5E5E5] rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
