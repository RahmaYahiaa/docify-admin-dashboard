import { useState } from 'react'
import { X, Upload } from 'lucide-react'
import { toast } from 'sonner'

export default function SpecialtyForm({ specialty = null, onClose, onSave }) {
  const isEdit = !!specialty

  const [form, setForm] = useState({
    name: specialty?.name || '',
    description: specialty?.description || '',
    image: specialty?.image || null,
  })

  const [preview, setPreview] = useState(specialty?.image || null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setForm((prev) => ({ ...prev, image: file }))
  }

  const handleRemoveImage = () => {
    setPreview(null)
    setForm((prev) => ({ ...prev, image: null }))
  }

  const handleSubmit = () => {
    if (!form.name.trim()) return toast.error('Specialty name is required')
    if (!form.description.trim()) return toast.error('Description is required')
    if (!preview) return toast.error('Please upload an image')
    onSave(form)
    toast.success(isEdit ? 'Specialty updated!' : 'Specialty added!')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] w-full max-w-2xl">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#E5E5E5]">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEdit ? 'Edit Specialty' : 'Add New Specialty'}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {isEdit
                ? 'Update specialty information and image'
                : 'Create a new medical specialty for doctors to select'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">

          {/* Specialty Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Specialty Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Cardiology"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Brief description of this medical specialty"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Specialty Image <span className="text-red-500">*</span>
            </label>

            {preview ? (
              <div className="relative rounded-lg overflow-hidden border border-[#E5E5E5]">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow border border-[#E5E5E5] hover:bg-slate-50"
                >
                  <X size={14} className="text-slate-600" />
                </button>
                {isEdit && (
                  <p className="text-xs text-slate-400 mt-1.5 px-1">
                    Click the X to remove and upload a different image
                  </p>
                )}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#E5E5E5] rounded-lg h-40 cursor-pointer hover:border-[#0066CC] transition-colors">
                <Upload size={24} className="text-slate-400" />
                <span className="text-sm text-slate-500">Click to upload image</span>
                <span className="text-xs text-slate-400">PNG, JPG up to 10MB</span>
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

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E5E5]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 border border-[#E5E5E5] rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3] transition-colors"
          >
            {isEdit ? '✓ Save Changes' : '✓ Add Specialty'}
          </button>
        </div>

      </div>
    </div>
  )
}