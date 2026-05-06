import { X, User, Stethoscope, Video, MapPin, DollarSign } from 'lucide-react'
import { formatAppointmentId, formatStatus } from '@/utils/formatters'

const STATUS_STYLES = {
  confirmed:  'text-blue-600 bg-blue-50',
  completed:  'text-green-600 bg-green-50',
  cancelled:  'text-red-600 bg-red-50',
  no_show:    'text-slate-600 bg-slate-100',
}

const PAYMENT_STYLES = {
  paid:     'text-green-600 bg-green-50',
  pending:  'text-orange-600 bg-orange-50',
  refunded: 'text-blue-600 bg-blue-50',
  failed:   'text-red-600 bg-red-50',
}

function Badge({ status, styles }) {
  const style = styles[status] || 'text-slate-600 bg-slate-100'
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {formatStatus(status)}
    </span>
  )
}

export default function AppointmentDetailsModal({ appointment, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] w-[672px] max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Appointment Details</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {formatAppointmentId(appointment.appointment_id)}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Patient */}
          <div className="flex items-center gap-3 pb-4 border-b border-[#E5E5E5]">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Patient</p>
              <p className="text-sm font-semibold text-slate-900">{appointment.patient}</p>
            </div>
          </div>

          {/* Doctor */}
          <div className="flex items-center gap-3 pb-4 border-b border-[#E5E5E5]">
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
              <Stethoscope size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Doctor</p>
              <p className="text-sm font-semibold text-slate-900">{appointment.doctor}</p>
              <p className="text-xs text-slate-400">{appointment.specialty || '—'}</p>
            </div>
          </div>

          {/* Date & Type */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#E5E5E5]">
            <div>
              <p className="text-xs text-slate-400 mb-1">Date & Time</p>
              <p className="text-sm font-medium text-slate-900">{appointment.date}</p>
              <p className="text-sm text-slate-600">{appointment.time}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Type</p>
              <div className="flex items-center gap-1.5">
                {appointment.type === 'video' ? (
                  <Video size={14} className="text-purple-500" />
                ) : (
                  <MapPin size={14} className="text-blue-500" />
                )}
                <span className={`text-sm font-medium ${
                  appointment.type === 'video' ? 'text-purple-600' : 'text-blue-600'
                }`}>
                  {appointment.type === 'video' ? 'Video Consultation' : 'In-person Visit'}
                </span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#E5E5E5]">
            <div>
              <p className="text-xs text-slate-400 mb-1">Appointment Status</p>
              <Badge status={appointment.status} styles={STATUS_STYLES} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Payment Status</p>
              {appointment.payment_status ? (
                <Badge status={appointment.payment_status} styles={PAYMENT_STYLES} />
              ) : (
                <span className="text-sm text-slate-400">—</span>
              )}
            </div>
          </div>

          {/* Payment Info */}
          {appointment.amount && (
            <div className="bg-green-50 border border-green-100 rounded-[10px] px-4 py-3">
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-green-600" />
                <div>
                  <p className="text-xs text-slate-400">Total Amount</p>
                  <p className="text-lg font-bold text-slate-900">${appointment.amount}</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-[#E5E5E5]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 border border-[#E5E5E5] rounded-lg hover:bg-slate-50"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  )
}