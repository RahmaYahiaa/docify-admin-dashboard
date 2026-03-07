import { useState } from 'react'
import { Search, Eye, XCircle, Video, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '@/components/shared/PageHeader'
import AppointmentDetailsModal from './components/AppointmentDetailsModal'
import CancelAppointmentModal from './components/CancelAppointmentModal'
import { appointments as initialData } from '@/features/appointments/data/mockData'

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'Upcoming' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' },
]

const STATUS_STYLES = {
  'Upcoming':  'text-blue-600 bg-blue-50',
  'Completed': 'text-green-600 bg-green-50',
  'Cancelled': 'text-red-600 bg-red-50',
  'No-show':   'text-slate-600 bg-slate-100',
}

const PAYMENT_STYLES = {
  'Paid':     'text-green-600 bg-green-50',
  'Pending':  'text-orange-500 bg-orange-50',
  'Refunded': 'text-blue-600 bg-blue-50',
  'Failed':   'text-red-600 bg-red-50',
}

function StatusBadge({ status, styles }) {
  const style = styles[status] || 'text-slate-600 bg-slate-100'
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(initialData)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [viewAppointment, setViewAppointment] = useState(null)
  const [cancelAppointment, setCancelAppointment] = useState(null)

  const filtered = appointments.filter((a) => {
    const matchTab = activeTab === 'all' || a.status === activeTab
    const matchSearch =
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.patient.name.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor.name.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const getTabCount = (value) => {
    if (value === 'all') return appointments.length
    return appointments.filter((a) => a.status === value).length
  }

  const handleCancel = (reason) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === cancelAppointment.id
          ? { ...a, status: 'Cancelled', payment: 'Refunded' }
          : a
      )
    )
    toast.success('Appointment cancelled successfully')
    setCancelAppointment(null)
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <PageHeader
        title="Appointments Oversight"
        subtitle="Monitor and manage all platform appointments"
      />

      {/* Table Card */}
      <div className="bg-white rounded-[10px] border border-[#E5E5E5]">

        {/* Search */}
        <div className="p-4 border-b border-[#E5E5E5]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by appointment ID, patient, or doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 border-b border-[#E5E5E5]">
          <div className="flex gap-6">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
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
                  {getTabCount(tab.value)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E5E5]">
              {['APPOINTMENT ID', 'PATIENT', 'DOCTOR', 'DATE & TIME', 'TYPE', 'STATUS', 'PAYMENT', 'ACTIONS'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((apt) => (
              <tr key={apt.id} className="border-b border-[#E5E5E5] last:border-0 hover:bg-slate-50 transition-colors">

                {/* ID */}
                <td className="px-4 py-4 text-xs font-mono text-slate-600 whitespace-nowrap">
                  {apt.id}
                </td>

                {/* Patient */}
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-slate-900">{apt.patient.name}</p>
                  <p className="text-xs text-slate-400">ID: {apt.patient.id}</p>
                </td>

                {/* Doctor */}
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-slate-900">{apt.doctor.name}</p>
                  <p className="text-xs text-slate-400">{apt.doctor.specialty}</p>
                </td>

                {/* Date & Time */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <p className="text-sm text-slate-900">{apt.date}</p>
                  <p className="text-xs text-slate-400">{apt.time}</p>
                </td>

                {/* Type */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    {apt.type === 'Video' ? (
                      <Video size={13} className="text-purple-500" />
                    ) : (
                      <MapPin size={13} className="text-blue-500" />
                    )}
                    <span className={`text-xs font-medium ${
                      apt.type === 'Video' ? 'text-purple-600' : 'text-blue-600'
                    }`}>
                      {apt.type}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <StatusBadge status={apt.status} styles={STATUS_STYLES} />
                </td>

                {/* Payment */}
                <td className="px-4 py-4">
                  <StatusBadge status={apt.payment} styles={PAYMENT_STYLES} />
                </td>

                {/* Actions */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewAppointment(apt)}
                      className="p-1.5 text-slate-400 hover:text-[#0066CC] hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={15} />
                    </button>
                    {apt.status === 'Upcoming' && (
                      <button
                        onClick={() => setCancelAppointment(apt)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancel Appointment"
                      >
                        <XCircle size={15} />
                      </button>
                    )}
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#E5E5E5]">
          <span className="text-sm text-slate-500">
            Showing {filtered.length} of {appointments.length} appointments
          </span>
        </div>

      </div>

      {/* Modals */}
      {viewAppointment && (
        <AppointmentDetailsModal
          appointment={viewAppointment}
          onClose={() => setViewAppointment(null)}
          onCancel={(apt) => setCancelAppointment(apt)}
        />
      )}

      {cancelAppointment && (
        <CancelAppointmentModal
          appointment={cancelAppointment}
          onClose={() => setCancelAppointment(null)}
          onConfirm={handleCancel}
        />
      )}

    </div>
  )
}