import { useState } from 'react'
import { Search, Eye, RefreshCw, CreditCard, Banknote } from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '@/components/shared/PageHeader'
import PaymentDetailsModal from './components/PaymentDetailsModal'
import RefundDetailsModal from './components/RefundDetailsModal'
import RetryRefundModal from './components/RetryRefundModal'
import { payments as initialPayments, refunds as initialRefunds } from '@/features/payments/data/mockData'

// ── Status Badge ──
const PAYMENT_STATUS = {
  Completed:  'text-green-600 bg-green-50',
  Pending:    'text-orange-500 bg-orange-50',
  Failed:     'text-red-600 bg-red-50',
}

const REFUND_STATUS = {
  Completed:  'text-green-600 bg-green-50',
  Failed:     'text-red-600 bg-red-50',
  Processing: 'text-orange-500 bg-orange-50',
}

function Badge({ label, styles }) {
  const style = styles[label] || 'text-slate-600 bg-slate-100'
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}

// ── Main Page ──
export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('payments')
  const [search, setSearch] = useState('')
  const [payments, setPayments] = useState(initialPayments)
  const [refunds, setRefunds] = useState(initialRefunds)
  const [viewPayment, setViewPayment] = useState(null)
  const [viewRefund, setViewRefund] = useState(null)
  const [retryRefund, setRetryRefund] = useState(null)

  const filteredPayments = payments.filter((p) =>
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.patient.name.toLowerCase().includes(search.toLowerCase())
  )

  const filteredRefunds = refunds.filter((r) =>
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    r.patient.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleRetry = (refund) => {
    setRefunds((prev) =>
      prev.map((r) => r.id === refund.id ? { ...r, status: 'Processing' } : r)
    )
    toast.success(`Refund ${refund.id} is being retried`)
    setRetryRefund(null)
  }

  return (
    <div className="space-y-6">

      <PageHeader
        title="Payments & Refunds"
        subtitle="Monitor all financial transactions"
      />

      {/* Table Card */}
      <div className="bg-white rounded-[10px] border border-[#E5E5E5]">

        {/* Search */}
        <div className="p-4 border-b border-[#E5E5E5]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 border-b border-[#E5E5E5]">
          <div className="flex gap-6">
            {[
              { label: 'Payments', value: 'payments', count: payments.length },
              { label: 'Refunds',  value: 'refunds',  count: refunds.length  },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => { setActiveTab(tab.value); setSearch('') }}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.value
                    ? 'border-[#0066CC] text-[#0066CC]'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.value
                    ? 'bg-blue-50 text-[#0066CC]'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Payments Table ── */}
        {activeTab === 'payments' && (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                {['TRANSACTION ID', 'APPOINTMENT ID', 'PATIENT', 'METHOD', 'AMOUNT', 'STATUS', 'DATE & TIME', 'ACTIONS'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={p.id} className="border-b border-[#E5E5E5] last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 text-xs font-mono text-slate-600 whitespace-nowrap">{p.id}</td>
                  <td className="px-4 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">{p.appointmentId}</td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-slate-900">{p.patient.name}</p>
                    <p className="text-xs text-slate-400">ID: {p.patient.id}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      {p.method === 'Card'
                        ? <CreditCard size={13} className="text-blue-500" />
                        : <Banknote size={13} className="text-green-500" />}
                      <span className="text-sm text-slate-600">{p.method}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-900">${p.amount}</td>
                  <td className="px-4 py-4"><Badge label={p.status} styles={PAYMENT_STATUS} /></td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <p className="text-sm text-slate-900">{p.date}</p>
                    <p className="text-xs text-slate-400">{p.time}</p>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => setViewPayment(p)}
                      className="p-1.5 text-slate-400 hover:text-[#0066CC] hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ── Refunds Table ── */}
        {activeTab === 'refunds' && (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                {['REFUND ID', 'TRANSACTION ID', 'PATIENT', 'AMOUNT', 'STATUS', 'DATE & TIME', 'ACTIONS'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRefunds.map((r) => (
                <tr key={r.id} className="border-b border-[#E5E5E5] last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 text-xs font-mono text-slate-600 whitespace-nowrap">{r.id}</td>
                  <td className="px-4 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">{r.transactionId}</td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-slate-900">{r.patient.name}</p>
                    <p className="text-xs text-slate-400">ID: {r.patient.id}</p>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-900">${r.amount}</td>
                  <td className="px-4 py-4"><Badge label={r.status} styles={REFUND_STATUS} /></td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <p className="text-sm text-slate-900">{r.date}</p>
                    <p className="text-xs text-slate-400">{r.time}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewRefund(r)}
                        className="p-1.5 text-slate-400 hover:text-[#0066CC] hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={15} />
                      </button>
                      {r.status === 'Failed' && (
                        <button
                          onClick={() => setRetryRefund(r)}
                          className="p-1.5 text-slate-400 hover:text-[#0066CC] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Retry Refund"
                        >
                          <RefreshCw size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#E5E5E5]">
          <span className="text-sm text-slate-500">
            Showing {activeTab === 'payments' ? filteredPayments.length : filteredRefunds.length} of{' '}
            {activeTab === 'payments' ? payments.length : refunds.length}{' '}
            {activeTab}
          </span>
        </div>

      </div>

      {/* Modals */}
      {viewPayment && (
        <PaymentDetailsModal
          payment={viewPayment}
          onClose={() => setViewPayment(null)}
        />
      )}
      {viewRefund && (
        <RefundDetailsModal
          refund={viewRefund}
          onClose={() => setViewRefund(null)}
          onRetry={(r) => setRetryRefund(r)}
        />
      )}
      {retryRefund && (
        <RetryRefundModal
          refund={retryRefund}
          onClose={() => setRetryRefund(null)}
          onConfirm={handleRetry}
        />
      )}

    </div>
  )
}