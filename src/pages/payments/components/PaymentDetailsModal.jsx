import { X, User, Stethoscope, CreditCard, Banknote, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react'

const STATUS_CONFIG = {
  Completed: {
    bg: 'bg-green-50',
    border: 'border-green-100',
    icon: <CheckCircle size={18} className="text-green-500" />,
    label: 'text-green-700',
    sub: 'text-green-600',
  },
  Pending: {
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    icon: <Clock size={18} className="text-orange-500" />,
    label: 'text-orange-700',
    sub: 'text-orange-600',
  },
  Failed: {
    bg: 'bg-red-50',
    border: 'border-red-100',
    icon: <XCircle size={18} className="text-red-500" />,
    label: 'text-red-700',
    sub: 'text-red-600',
  },
}

export default function PaymentDetailsModal({ payment, onClose }) {
  const config = STATUS_CONFIG[payment.status] || STATUS_CONFIG.Pending

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] w-[672px] max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Payment Details</h2>
            <p className="text-xs text-slate-400 mt-0.5">{payment.id}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Status Banner */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-[10px] border ${config.bg} ${config.border}`}>
            {config.icon}
            <div>
              <p className={`text-sm font-semibold ${config.label}`}>
                Payment {payment.status}
              </p>
              <p className={`text-xs ${config.sub}`}>
                {payment.date} at {payment.time}
              </p>
            </div>
          </div>

          {/* Amount */}
          <div className="bg-slate-50 rounded-[10px] px-6 py-5 text-center border border-[#E5E5E5]">
            <p className="text-xs text-slate-400 mb-1">Total Amount</p>
            <p className="text-4xl font-bold text-slate-900">${payment.amount}</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              {payment.method === 'Card' ? (
                <CreditCard size={14} className="text-blue-500" />
              ) : (
                <Banknote size={14} className="text-green-500" />
              )}
              <span className="text-sm text-slate-600">
                {payment.method === 'Card'
                  ? `Card ending in ${payment.cardEnding}`
                  : 'Cash Payment'}
              </span>
            </div>
          </div>

          {/* Patient & Doctor */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[#E5E5E5] rounded-[10px] p-4">
              <div className="flex items-center gap-2 mb-2">
                <User size={14} className="text-slate-400" />
                <p className="text-xs text-slate-400">Patient</p>
              </div>
              <p className="text-sm font-semibold text-slate-900">{payment.patient.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">ID: {payment.patient.id}</p>
            </div>
            <div className="border border-[#E5E5E5] rounded-[10px] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope size={14} className="text-slate-400" />
                <p className="text-xs text-slate-400">Doctor</p>
              </div>
              <p className="text-sm font-semibold text-slate-900">{payment.doctor.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">ID: {payment.doctor.id}</p>
            </div>
          </div>

          {/* Appointment ID */}
          <div className="border border-[#E5E5E5] rounded-[10px] p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={14} className="text-slate-400" />
              <p className="text-xs text-slate-400">Appointment ID</p>
            </div>
            <p className="text-sm font-semibold text-slate-900">{payment.appointmentId}</p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E5E5E5]">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-medium text-slate-700 border border-[#E5E5E5] rounded-lg hover:bg-slate-50"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  )
}