import { useState } from "react";
import { X, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function SpecialtyForm({
  specialty = null,
  onClose,
  onSave,
  loading = false,
}) {
  const isEdit = !!specialty;

  // Form field state
  const [name, setName] = useState(specialty?.name || "");
  const [description, setDescription] = useState(specialty?.description || "");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(specialty?.image || null);

  // ------------------------------------------------------------------
  // Image selection
  // ------------------------------------------------------------------
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous object URL to avoid memory leaks
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    // Reset the input so the same file can be selected again if needed
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(specialty?.icon_url || null);
  };

  // ------------------------------------------------------------------
  // Submit validation and call parent
  // ------------------------------------------------------------------
  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Specialty name is required");
      return;
    }

    // For a NEW specialty require an image
    if (!isEdit && !imageFile) {
      toast.error("Please upload an image for the specialty");
      return;
    }

    // Pass raw values — parent (SpecialtiesPage) builds FormData
    onSave({
      name: name.trim(),
      description: description.trim(),
      image: imageFile, // File | null
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* ── Header ── */}
        <div className="flex items-start justify-between p-6 border-b border-[#E5E5E5]">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEdit ? "Edit Specialty" : "Add New Specialty"}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {isEdit
                ? "Update specialty information and image"
                : "Create a new medical specialty"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Fields ── */}
        <div className="p-6 space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Specialty Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Cardiology"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Description
              <span className="text-slate-400 font-normal ml-1">
                (optional)
              </span>
            </label>
            <textarea
              placeholder="Brief description of this medical specialty"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors resize-none"
            />
          </div>

          {/* Image */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Specialty Image
              {!isEdit && <span className="text-red-500 ml-0.5">*</span>}
              {isEdit && (
                <span className="text-slate-400 font-normal ml-1">
                  (leave unchanged to keep current image)
                </span>
              )}
            </label>

            {previewUrl ? (
              /* ── Preview ── */
              <div className="relative rounded-lg overflow-hidden border border-[#E5E5E5]">
                <img
                  src={previewUrl}
                  alt="Specialty preview"
                  className="w-full h-48 object-cover bg-slate-50"
                  onError={(e) => {
                    e.target.src = "/images/default-specialization.png";
                  }}
                />

                {/* Overlay controls */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                  {/* Change image — re-opens picker */}
                  <label className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  {/* Remove image */}
                  <button
                    onClick={handleRemoveImage}
                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>

                {/* Small X button in corner */}
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow border border-[#E5E5E5] hover:bg-slate-50"
                >
                  <X size={14} className="text-slate-600" />
                </button>
              </div>
            ) : (
              /* ── Upload dropzone ── */
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#E5E5E5] rounded-lg h-40 cursor-pointer hover:border-[#0066CC] transition-colors group">
                <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                  <Upload
                    size={20}
                    className="text-slate-400 group-hover:text-[#0066CC] transition-colors"
                  />
                </div>
                <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
                  Click to upload image
                </span>
                <span className="text-xs text-slate-400">
                  PNG, JPG, WEBP — up to 10 MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E5E5]">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-700 border border-[#E5E5E5] rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isEdit ? "Saving…" : "Creating…"}
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Add Specialty"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
