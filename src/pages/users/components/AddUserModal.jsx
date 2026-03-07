import { useState } from "react";
import {
  X,
  Stethoscope,
  Heart,
  User,
  Shield,
  Info,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

const ROLES = [
  {
    id: "Doctor",
    label: "Doctor",
    desc: "Medical professional providing care",
    icon: Stethoscope,
    color: "text-blue-600",
    border: "border-blue-200 hover:border-blue-400",
  },
  {
    id: "Patient",
    label: "Patient",
    desc: "Individual receiving medical care",
    icon: Heart,
    color: "text-green-600",
    border: "border-green-200 hover:border-green-400",
  },
  {
    id: "Assistant",
    label: "Assistant",
    desc: "Supporting doctor with daily tasks",
    icon: User,
    color: "text-purple-600",
    border: "border-purple-200 hover:border-purple-400",
  },
  {
    id: "Admin",
    label: "Admin",
    desc: "Platform administrator",
    icon: Shield,
    color: "text-red-600",
    border: "border-red-200 hover:border-red-400",
  },
];
const DOCTORS = [
  { id: "D001", name: "Dr. Sarah Johnson", specialty: "Cardiologist" },
  { id: "D002", name: "Dr. Michael Chen", specialty: "Pediatrician" },
  { id: "D003", name: "Dr. Emily Williams", specialty: "Dermatologist" },
  { id: "D004", name: "Dr. Ahmed Hassan", specialty: "Neurologist" },
  { id: "D005", name: "Dr. Lisa Anderson", specialty: "Orthopedic Surgeon" },
];

export default function AddUserModal({ onClose, onSave }) {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [passwordMethod, setPasswordMethod] = useState("auto");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [showDoctorList, setShowDoctorList] = useState(false);
  const [certificatePreview, setCertificatePreview] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    licenseNumber: "",
    certificate: null,
    linkedDoctor: "",
    linkedDoctorId: "",
    adminLevel: "",
  });

  const handleCreate = () => {
    if (!form.name.trim()) return toast.error("Full name is required");
    if (!form.email.trim()) return toast.error("Email is required");
    onSave({ ...form, role: selectedRole, status: "Active" });
    toast.success("User created successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5E5E5]">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Add New User
            </h2>
            <p className="text-xs text-slate-500">
              {step === 1
                ? "Select user role"
                : `Creating ${selectedRole?.toLowerCase()}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {/* Step 1 — Role Selection */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role.id);
                      setStep(2);
                    }}
                    className={`p-4 rounded-[10px] border-2 text-left transition-colors ${role.border}`}
                  >
                    <Icon size={24} className={`${role.color} mb-2`} />
                    <p className="text-sm font-semibold text-slate-900">
                      {role.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{role.desc}</p>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 2 — Form */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Basic Information
                </h3>

                {[
                  {
                    label: "Full Name",
                    key: "name",
                    placeholder: "Enter full name",
                  },
                  {
                    label: "Email Address",
                    key: "email",
                    placeholder: "email@example.com",
                  },
                  {
                    label: "Phone Number",
                    key: "phone",
                    placeholder: "+1 (555) 123-4567",
                  },
                ].map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      {field.label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [field.key]: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC]"
                    />
                  </div>
                ))}
              </div>

              {/* Password */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Temporary Password
                </h3>
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
                      onClick={() => setPasswordMethod(m.id)}
                      className="p-3 rounded-lg border border-[#E5E5E5] bg-white text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            passwordMethod === m.id
                              ? "border-[#0066CC]"
                              : "border-slate-300"
                          }`}
                        >
                          {passwordMethod === m.id && (
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

                {/* Info box */}
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                  <Info size={16} className="text-blue-500 shrink-0" />
                  <p className="text-sm text-blue-700">
                    User will be required to change this password on first login
                    for security.
                  </p>
                </div>
              </div>
              {/* Role Specific */}
              {selectedRole === "Doctor" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Doctor Information
                  </h3>

                  {/* Specialty */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Specialty <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.specialty}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, specialty: e.target.value }))
                      }
                      placeholder="e.g., Cardiology"
                      className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC]"
                    />
                  </div>

                  {/* License Number */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Medical License Number{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.licenseNumber}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          licenseNumber: e.target.value,
                        }))
                      }
                      placeholder="Enter license number"
                      className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC]"
                    />
                  </div>

                  {/* Medical Certificate Upload */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Medical Certificate
                    </label>

                    {certificatePreview ? (
                      <div className="flex items-center justify-between p-3 border border-[#E5E5E5] rounded-lg bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-red-500">
                              PDF
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {certificatePreview.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {certificatePreview.size}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setCertificatePreview(null);
                            setForm((p) => ({ ...p, certificate: null }));
                          }}
                          className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          <X size={14} className="text-slate-500" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#E5E5E5] rounded-lg h-28 cursor-pointer hover:border-[#0066CC] transition-colors">
                        <Upload size={20} className="text-slate-400" />
                        <span className="text-sm text-slate-500">
                          Drop file here or click to browse
                        </span>
                        <span className="text-xs text-slate-400">
                          PDF, JPG, PNG (Max 5MB)
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const sizeMB = (file.size / 1024 / 1024).toFixed(1);
                            setCertificatePreview({
                              name: file.name,
                              size: `${sizeMB} MB`,
                            });
                            setForm((p) => ({ ...p, certificate: file }));
                          }}
                        />
                      </label>
                    )}
                  </div>

                  {/* Warning */}
                  <div className="flex items-center gap-2 bg-orange-50 border border-orange-300 rounded-lg px-4 py-3">
                    <Info size={16} className="text-orange-500 shrink-0" />
                    <p className="text-sm text-orange-700">
                      Doctor account will be marked as "Pending Verification"
                      until credentials are reviewed.
                    </p>
                  </div>
                </div>
              )}
              {selectedRole === "Assistant" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Assistant Information
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Linked Doctor <span className="text-red-500">*</span>
                    </label>

                    {/* Search Input */}
                    <div className="relative">
                      <input
                        value={doctorSearch}
                        onChange={(e) => {
                          setDoctorSearch(e.target.value);
                          setShowDoctorList(true);
                          setForm((p) => ({
                            ...p,
                            linkedDoctor: "",
                            linkedDoctorId: "",
                          }));
                        }}
                        onFocus={() => setShowDoctorList(true)}
                        placeholder="Search for a doctor..."
                        className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC]"
                      />

                      {/* Selected Doctor Tag */}
                      {form.linkedDoctor && (
                        <div className="mt-2 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                          <span className="text-sm text-blue-700 font-medium">
                            {form.linkedDoctor}
                          </span>
                          <button
                            onClick={() => {
                              setForm((p) => ({
                                ...p,
                                linkedDoctor: "",
                                linkedDoctorId: "",
                              }));
                              setDoctorSearch("");
                            }}
                            className="ml-auto"
                          >
                            <X size={14} className="text-blue-500" />
                          </button>
                        </div>
                      )}

                      {/* Dropdown List */}
                      {showDoctorList && doctorSearch && !form.linkedDoctor && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E5E5] rounded-lg shadow-lg z-10 overflow-hidden">
                          {DOCTORS.filter(
                            (d) =>
                              d.name
                                .toLowerCase()
                                .includes(doctorSearch.toLowerCase()) ||
                              d.specialty
                                .toLowerCase()
                                .includes(doctorSearch.toLowerCase()),
                          ).length === 0 ? (
                            <div className="px-4 py-3 text-sm text-slate-400">
                              No doctors found
                            </div>
                          ) : (
                            DOCTORS.filter(
                              (d) =>
                                d.name
                                  .toLowerCase()
                                  .includes(doctorSearch.toLowerCase()) ||
                                d.specialty
                                  .toLowerCase()
                                  .includes(doctorSearch.toLowerCase()),
                            ).map((doc) => (
                              <button
                                key={doc.id}
                                onClick={() => {
                                  setForm((p) => ({
                                    ...p,
                                    linkedDoctor: doc.name,
                                    linkedDoctorId: doc.id,
                                  }));
                                  setDoctorSearch(doc.name);
                                  setShowDoctorList(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
                              >
                                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                  <span className="text-xs font-semibold text-blue-600">
                                    {doc.name.charAt(3)}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-900">
                                    {doc.name}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {doc.specialty}
                                  </p>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {selectedRole === "Admin" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Admin Information
                  </h3>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Admin Level <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.adminLevel}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, adminLevel: e.target.value }))
                      }
                      placeholder="Admin or Super Admin"
                      className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC]"
                    />
                    <p className="text-xs text-slate-400">
                      Super Admins can manage other admins
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 2 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#E5E5E5]">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Back
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 border border-[#E5E5E5] rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3]"
              >
                Create User
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
