import { useState } from "react";
import { X, Stethoscope, Shield, Info, Upload } from "lucide-react";
import { toast } from "sonner";
import { useSpecializations } from "@/hooks/useSpecializations";

const ROLES = [
  {
    id: "Doctor",
    label: "Doctor",
    desc: "Medical professional providing care",
    icon: Stethoscope,
    color: "text-blue-600",
    activeBg: "bg-blue-50",
    border: "border-[#E5E5E5] hover:border-blue-300",
  },
  {
    id: "Admin",
    label: "Admin",
    desc: "Platform administrator",
    icon: Shield,
    color: "text-purple-600",
    activeBg: "bg-purple-50",
    border: "border-[#E5E5E5] hover:border-purple-300",
  },
];

const ADMIN_LEVELS = [
  { label: "Admin", value: "admin" },
  { label: "Super Admin", value: "super admin" },
];

export default function AddUserModal({ onClose, onSave, loading = false }) {
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);

  // Specialization search state
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [specializationSearch, setSpecializationSearch] = useState("");
  const [showSpecializations, setShowSpecializations] = useState(false);

  // Certificate upload preview
  const [certificatePreview, setCertificatePreview] = useState(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    // Doctor
    specialization_id: "",
    certificate: null,
    // Admin
    admin_level: "admin",
  });

  //  fetch real specializations from API
  const { data: specializations = [], isLoading: specLoading } =
    useSpecializations();

  const filteredSpecs = specializations.filter((s) =>
    (s?.name || "").toLowerCase().includes(specializationSearch.toLowerCase()),
  );
  // ─────────────────────────────────────────────────────────────────────

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const resetToStep1 = () => {
    setStep(1);
    setSelectedRole(null);
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      specialization_id: "",
      certificate: null,
      admin_level: "admin",
    });
    setErrors({});
    setSelectedSpecialization(null);
    setSpecializationSearch("");
    setShowSpecializations(false);
    setCertificatePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!form.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (selectedRole === "Doctor") {
      if (!form.specialization_id)
        newErrors.specialization_id = "Specialization is required";
      if (!form.certificate)
        newErrors.certificate = "Medical certificate is required";
    }

    if (selectedRole === "Admin") {
      if (!form.admin_level) newErrors.admin_level = "Admin level is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }
    onSave({ ...form, role: selectedRole });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5E5E5]">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Add New User
            </h2>
            <p className="text-xs text-slate-400">
              {step === 1
                ? "Select user role"
                : `Creating ${selectedRole?.toLowerCase()} account`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/*  Step 1: Role Selection  */}
        {step === 1 && (
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
              {ROLES.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role.id);
                      setStep(2);
                      setErrors({});
                    }}
                    className={`p-5 rounded-[10px] border-2 text-left transition-all ${role.border} hover:shadow-sm`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg ${role.activeBg} flex items-center justify-center mb-3`}
                    >
                      <Icon size={20} className={role.color} />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      {role.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{role.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-start gap-2 bg-slate-50 border border-[#E5E5E5] rounded-lg px-4 py-3">
              <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500">
                Patients and assistants register through the mobile app. Only
                doctors and admins are created from the dashboard.
              </p>
            </div>
          </div>
        )}

        {/*  Step 2: Form  */}
        {step === 2 && (
          <div className="p-5 space-y-5">
            {/* Basic Info */}
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
                    onChange={handleChange("first_name")}
                    placeholder="First name"
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
                      errors.first_name
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#E5E5E5] focus:border-[#0066CC]"
                    }`}
                  />
                  {errors.first_name && (
                    <p className="text-xs text-red-500">{errors.first_name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.last_name}
                    onChange={handleChange("last_name")}
                    placeholder="Last name"
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
                      errors.last_name
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#E5E5E5] focus:border-[#0066CC]"
                    }`}
                  />
                  {errors.last_name && (
                    <p className="text-xs text-red-500">{errors.last_name}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="email@example.com"
                  type="email"
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
                    errors.email
                      ? "border-red-400 focus:border-red-500"
                      : "border-[#E5E5E5] focus:border-[#0066CC]"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.phone}
                  onChange={handleChange("phone")}
                  placeholder="+20 100 000 0000"
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
                    errors.phone
                      ? "border-red-400 focus:border-red-500"
                      : "border-[#E5E5E5] focus:border-[#0066CC]"
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone}</p>
                )}
              </div>
            </section>

            {/* Password auto-generate note */}
            <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
              <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                A secure temporary password will be auto-generated and emailed
                to the user. They must change it on first login.
              </p>
            </div>

            {/*  Doctor Section  */}
            {selectedRole === "Doctor" && (
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Doctor Information
                </h3>

                {/* Searchable specialization dropdown */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Specialization <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      value={specializationSearch}
                      onChange={(e) => {
                        setSpecializationSearch(e.target.value);
                        setShowSpecializations(true);
                        // clear selection when user types again
                        if (selectedSpecialization) {
                          setSelectedSpecialization(null);
                          setForm((p) => ({ ...p, specialization_id: "" }));
                        }
                        setErrors((p) => ({ ...p, specialization_id: "" }));
                      }}
                      onFocus={() => setShowSpecializations(true)}
                      onBlur={() =>
                        // small delay so click inside list registers first
                        setTimeout(() => setShowSpecializations(false), 150)
                      }
                      placeholder={
                        specLoading
                          ? "Loading specializations..."
                          : "Search specialization..."
                      }
                      disabled={specLoading}
                      className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
                        errors.specialization_id
                          ? "border-red-400"
                          : "border-[#E5E5E5] focus:border-[#0066CC]"
                      } ${specLoading ? "bg-slate-50 cursor-wait" : ""}`}
                    />

                    {/* Dropdown */}
                    {showSpecializations && !selectedSpecialization && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E5E5] rounded-lg shadow-lg z-20 max-h-52 overflow-y-auto">
                        {specLoading ? (
                          <div className="px-4 py-3 text-sm text-slate-400">
                            Loading...
                          </div>
                        ) : filteredSpecs.length === 0 ? (
                          specializationSearch.trim() ? (
                            <div className="px-4 py-3 text-sm text-slate-400">
                              No specializations found
                            </div>
                          ) : null
                        ) : (
                          filteredSpecs.slice(0, 8).map((spec) => (
                            <button
                              key={spec.id}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                setSelectedSpecialization(spec);
                                setForm((p) => ({
                                  ...p,
                                  specialization_id: spec.id,
                                }));
                                setSpecializationSearch(spec.name);
                                setShowSpecializations(false);
                                setErrors((p) => ({
                                  ...p,
                                  specialization_id: "",
                                }));
                              }}
                              className="w-full px-4 py-2.5 text-left hover:bg-slate-50 transition-colors border-b border-[#F5F5F5] last:border-0"
                            >
                              <p className="text-sm font-medium text-slate-900">
                                {spec.name}
                              </p>
                              {spec.description && (
                                <p className="text-xs text-slate-400 mt-0.5 truncate">
                                  {spec.description}
                                </p>
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Selected tag */}
                  {selectedSpecialization && (
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                      <span className="text-sm text-blue-700 font-medium">
                        {selectedSpecialization.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSpecialization(null);
                          setSpecializationSearch("");
                          setForm((p) => ({ ...p, specialization_id: "" }));
                        }}
                        className="ml-auto text-blue-400 hover:text-blue-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {errors.specialization_id && (
                    <p className="text-xs text-red-500">
                      {errors.specialization_id}
                    </p>
                  )}
                </div>

                {/* Medical certificate upload */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Medical Certificate <span className="text-red-500">*</span>
                  </label>

                  {certificatePreview ? (
                    <div className="flex items-center justify-between p-3 border border-[#E5E5E5] rounded-lg bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-red-500">
                            {certificatePreview.ext.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">
                            {certificatePreview.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {certificatePreview.size}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
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
                    <label
                      className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg h-28 cursor-pointer hover:border-[#0066CC] transition-colors group ${
                        errors.certificate
                          ? "border-red-400"
                          : "border-[#E5E5E5]"
                      }`}
                    >
                      <Upload
                        size={20}
                        className="text-slate-300 group-hover:text-[#0066CC] transition-colors"
                      />
                      <span className="text-sm text-slate-400 group-hover:text-slate-600 transition-colors">
                        Drop file here or click to browse
                      </span>
                      <span className="text-xs text-slate-300">
                        PDF, JPG, PNG (Max 10MB)
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const sizeMB = (file.size / 1024 / 1024).toFixed(1);
                          const ext = file.name.split(".").pop() || "file";
                          setCertificatePreview({
                            name: file.name,
                            size: `${sizeMB} MB`,
                            ext,
                          });
                          setForm((p) => ({ ...p, certificate: file }));
                          setErrors((p) => ({ ...p, certificate: "" }));
                        }}
                      />
                    </label>
                  )}
                  {errors.certificate && (
                    <p className="text-xs text-red-500">{errors.certificate}</p>
                  )}
                </div>
              </section>
            )}

            {/*  Admin Section  */}
            {selectedRole === "Admin" && (
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Admin Information
                </h3>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Admin Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.admin_level}
                    onChange={handleChange("admin_level")}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none bg-white transition-colors ${
                      errors.admin_level
                        ? "border-red-400"
                        : "border-[#E5E5E5] focus:border-[#0066CC]"
                    }`}
                  >
                    {ADMIN_LEVELS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.admin_level && (
                    <p className="text-xs text-red-500">{errors.admin_level}</p>
                  )}
                  <p className="text-xs text-slate-400">
                    Super Admins can create and manage other admins.
                  </p>
                </div>
              </section>
            )}
          </div>
        )}

        {/* Footer */}
        {step === 2 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#E5E5E5]">
            <button
              onClick={resetToStep1}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 border border-[#E5E5E5] rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  `Create ${selectedRole}`
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
