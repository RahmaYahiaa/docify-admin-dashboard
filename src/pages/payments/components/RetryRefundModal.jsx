import { RefreshCw } from 'lucide-react'

export default function RetryRefundModal({ refund, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] w-full max-w-[448px]">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4">
          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
            <RefreshCw size={16} className="text-[#0066CC]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Retry Refund</h2>
            <p className="text-xs text-slate-400">
              Retry processing refund {refund.id}
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">

          {/* Original Reason */}
          <div className="border border-[#E5E5E5] rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">Original Reason</p>
            <p className="text-sm text-slate-700">{refund.reason}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 border border-[#E5E5E5] rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(refund)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3]"
            >
              <RefreshCw size={14} />
              Retry Refund
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}