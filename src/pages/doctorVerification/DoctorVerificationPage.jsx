import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Eye } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import StatusBadge from '@/components/shared/StatusBadge'
import { doctorApplications } from '@/features/doctorVerification/data/mockData'

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
]

export default function DoctorVerificationPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = doctorApplications.filter((doc) => {
    const matchTab = activeTab === 'all' || doc.status === activeTab
    const matchSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const getTabCount = (value) => {
    if (value === 'all') return doctorApplications.length
    return doctorApplications.filter((d) => d.status === value).length
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctor Verification"
        subtitle="Review and verify doctor applications"
      />

      {/* Table Card */}
      <div className="bg-white rounded-[10px] border border-[#E5E5E5]">

        {/* Search */}
        <div className="p-4 border-b border-[#E5E5E5]">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or specialty..."
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
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">
                Doctor Name
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">
                Specialty
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">
                Submission Date
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc) => (
              <tr key={doc.id} className="border-b border-[#E5E5E5] last:border-0 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-4 text-sm font-medium text-slate-900">
                  {doc.name}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {doc.specialty}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {doc.submissionDate}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={doc.status} />
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => navigate(`/doctor-verification/${doc.id}`)}
                    className="flex items-center gap-1.5 text-sm text-[#0066CC] hover:text-[#0052a3] font-medium transition-colors"
                  >
                    <Eye size={14} />
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#E5E5E5]">
          <span className="text-sm text-slate-500">
            Showing {filtered.length} of {doctorApplications.length} doctors
          </span>
        </div>

      </div>
    </div>
  )
}