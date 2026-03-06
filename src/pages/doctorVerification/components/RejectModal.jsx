import { useState } from 'react'
import { X } from 'lucide-react'

export default function RejectModal({ doctor, onClose, onConfirm }) {
  const [reason, setReason] = useState('')

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] w-[448px] p-6 space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Reject Application</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Please provide a reason for rejecting this application. This will be sent to the doctor.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Reason Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for rejection..."
            rows={4}
            className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors resize-none"
          />
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
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reject Application
          </button>
        </div>

      </div>
    </div>
  )
}