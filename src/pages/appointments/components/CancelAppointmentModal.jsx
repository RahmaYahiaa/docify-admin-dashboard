import { useState } from 'react'
import { XCircle } from 'lucide-react'

export default function CancelAppointmentModal({ appointment, onClose, onConfirm }) {
  const [reason, setReason] = useState('')

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] w-[448px]">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle size={16} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Cancel Appointment</h2>
            <p className="text-xs text-slate-400">APT {appointment.id} appointment</p>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">

          {/* Reason Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Cancellation Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for cancellation..."
              rows={4}
              className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] resize-none"
            />
          </div>

          {/* Note */}
          <p className="text-xs text-slate-400">
            This reason will be sent to both the patient and doctor.
          </p>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 border border-[#E5E5E5] rounded-lg hover:bg-slate-50"
            >
              Keep Appointment
            </button>
            <button
              onClick={() => onConfirm(reason)}
              disabled={!reason.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel Appointment
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}