import { X, AlertCircle } from 'lucide-react'

export default function DisableSpecialtyModal({ specialty, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] w-full max-w-[448px] p-6 space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle size={20} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Disable Specialty</h2>
              <p className="text-sm text-slate-500">
                Are you sure you want to disable "{specialty.name}"?
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Impact */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="text-orange-500" />
            <span className="text-sm font-medium text-orange-700">Impact of disabling:</span>
          </div>
          <ul className="space-y-1.5 ml-5">
            {[
              'New doctors cannot select this specialty',
              `${specialty.doctors} existing doctors remain unchanged`,
              'This specialty will not appear in public listings',
              'You can re-enable it anytime',
            ].map((item, i) => (
              <li key={i} className="text-sm text-orange-700 list-disc">{item}</li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 border border-[#E5E5E5] rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
          >
            Disable Specialty
          </button>
        </div>

      </div>
    </div>
  )
}