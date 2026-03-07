import { X, User, Calendar, FileText, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react'

const STATUS_CONFIG = {
  Completed: {
    bg: 'bg-green-50', border: 'border-green-100',
    icon: <CheckCircle size={18} className="text-green-500" />,
    label: 'text-green-700', sub: 'text-green-600',
  },
  Failed: {
    bg: 'bg-red-50', border: 'border-red-100',
    icon: <XCircle size={18} className="text-red-500" />,
    label: 'text-red-700', sub: 'text-red-600',
  },
  Processing: {
    bg: 'bg-orange-50', border: 'border-orange-100',
    icon: <Clock size={18} className="text-orange-500" />,
    label: 'text-orange-700', sub: 'text-orange-600',
  },
}

export default function RefundDetailsModal({ refund, onClose, onRetry }) {
  const config = STATUS_CONFIG[refund.status] || STATUS_CONFIG.Processing
  const isFailed = refund.status === 'Failed'

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] w-[672px] max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Refund Details</h2>
            <p className="text-xs text-slate-400 mt-0.5">{refund.id}</p>
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
                Refund {refund.status}
              </p>
              <p className={`text-xs ${config.sub}`}>{refund.date}</p>
            </div>
          </div>

          {/* Amount */}
          <div className="bg-purple-50 rounded-[10px] px-6 py-5 text-center border border-purple-100">
            <p className="text-xs text-slate-400 mb-1">Refund Amount</p>
            <p className="text-4xl font-bold text-slate-900">${refund.amount}</p>
          </div>

          {/* Reason */}
          <div className="border border-[#E5E5E5] rounded-[10px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={14} className="text-slate-400" />
              <p className="text-xs text-slate-400">Refund Reason</p>
            </div>
            <p className="text-sm text-slate-700">{refund.reason}</p>
          </div>

          {/* Patient & Transaction */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[#E5E5E5] rounded-[10px] p-4">
              <div className="flex items-center gap-2 mb-2">
                <User size={14} className="text-slate-400" />
                <p className="text-xs text-slate-400">Patient</p>
              </div>
              <p className="text-sm font-semibold text-slate-900">{refund.patient.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">ID: {refund.patient.id}</p>
            </div>
            <div className="border border-[#E5E5E5] rounded-[10px] p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} className="text-slate-400" />
                <p className="text-xs text-slate-400">Transaction ID</p>
              </div>
              <p className="text-sm font-semibold text-slate-900">{refund.transactionId}</p>
            </div>
          </div>

          {/* Appointment ID */}
          <div className="border border-[#E5E5E5] rounded-[10px] p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={14} className="text-slate-400" />
              <p className="text-xs text-slate-400">Appointment ID</p>
            </div>
            <p className="text-sm font-semibold text-slate-900">{refund.appointmentId}</p>
          </div>

        </div>

        {/* Footer */}
        <div className={`flex items-center px-6 py-4 border-t border-[#E5E5E5] ${isFailed ? 'justify-between' : 'justify-center'}`}>
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-slate-700 border border-[#E5E5E5] rounded-lg hover:bg-slate-50"
          >
            Close
          </button>
          {isFailed && (
            <button
              onClick={() => { onClose(); onRetry(refund) }}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3]"
            >
              <RefreshCw size={14} />
              Retry Refund
            </button>
          )}
        </div>

      </div>
    </div>
  )
}