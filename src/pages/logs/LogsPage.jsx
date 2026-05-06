import { useState, useMemo } from 'react'
import {
  Search, Filter,
  FileText, Clock, Shield, Cpu,
  User, Stethoscope,
  Ban, BadgeCheck, CalendarX, RefreshCw,
  UserCheck, XCircle, CreditCard, Pencil,
  CalendarPlus, LogIn, Info,
} from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { useLogs } from '@/hooks/useLogs'

const CATEGORY_STYLES = {
  user:        'bg-purple-50 text-purple-700',
  doctor:      'bg-blue-50 text-blue-700',
  appointment: 'bg-orange-50 text-orange-700',
  payment:     'bg-green-50 text-green-700',
  system:      'bg-slate-100 text-slate-600',
}

const ACTION_ICONS = {
  'User Suspended':        { icon: Ban,          color: 'text-red-500'    },
  'Doctor Verified':       { icon: BadgeCheck,   color: 'text-green-500'  },
  'Appointment Cancelled': { icon: CalendarX,    color: 'text-orange-500' },
  'Refund Processed':      { icon: RefreshCw,    color: 'text-blue-500'   },
  'User Reactivated':      { icon: UserCheck,    color: 'text-green-500'  },
  'Doctor Rejected':       { icon: XCircle,      color: 'text-red-500'    },
  'Payment Failed':        { icon: CreditCard,   color: 'text-red-500'    },
  'Profile Updated':       { icon: Pencil,       color: 'text-blue-500'   },
  'Appointment Created':   { icon: CalendarPlus, color: 'text-green-500'  },
  'Payment Processed':     { icon: CreditCard,   color: 'text-green-500'  },
  'Admin Login':           { icon: LogIn,        color: 'text-blue-500'   },
  'Refund Retry':          { icon: RefreshCw,    color: 'text-blue-500'   },
}

function ActionIcon({ action }) {
  const config = ACTION_ICONS[action] || { icon: Info, color: 'text-slate-400' }
  const Icon = config.icon
  return <Icon size={16} className={`${config.color} shrink-0`} />
}

function CategoryBadge({ category }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_STYLES[category] || 'bg-slate-100 text-slate-600'}`}>
      {category}
    </span>
  )
}

function ActorIcon({ role }) {
  const icons = {
    Admin:   <Shield size={12} className="text-red-500" />,
    Doctor:  <Stethoscope size={12} className="text-blue-500" />,
    Patient: <User size={12} className="text-green-500" />,
    System:  <Cpu size={12} className="text-slate-400" />,
  }
  return icons[role] || <User size={12} className="text-slate-400" />
}

const ACTOR_ROLES = ['All Roles', 'Admin', 'Doctor', 'Patient', 'Assistant', 'System']

export default function LogsPage() {
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [actionType, setActionType] = useState('All Types')
  const [actorRole, setActorRole] = useState('All Roles')

  const { data, isLoading, isError } = useLogs()

  const stats = data?.stats || {}
  const logs = data?.logs || []

  const ACTION_TYPES = ['All Types', ...new Set(logs.map(l => l.action.type))]

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        log.action.name.toLowerCase().includes(search.toLowerCase()) ||
        log.actor.name.toLowerCase().includes(search.toLowerCase()) ||
        log.target.name.toLowerCase().includes(search.toLowerCase())
      const matchType = actionType === 'All Types' || log.action.type === actionType
      const matchRole = actorRole === 'All Roles' || log.actor.role === actorRole
      return matchSearch && matchType && matchRole
    })
  }, [logs, search, actionType, actorRole])

  return (
    <div className="space-y-6">

      <PageHeader
        title="Logs & Audit"
        subtitle="Complete audit trail of all platform activities"
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard
          title="Total Logs"
          value={isLoading ? '—' : stats.total_logs ?? 0}
          icon={FileText}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Today"
          value={isLoading ? '—' : stats.today ?? 0}
          icon={Clock}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Admin Actions"
          value={isLoading ? '—' : stats.admin_actions ?? 0}
          icon={Shield}
          iconColor="text-red-500"
        />
        <StatsCard
          title="System Events"
          value={isLoading ? '—' : stats.system_events ?? 0}
          icon={Cpu}
          iconColor="text-purple-500"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[10px] border border-[#E5E5E5]">

        {/* Search + Filter */}
        <div className="flex items-center gap-3 p-4 border-b border-[#E5E5E5]">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs by action, actor, or target..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              showFilters
                ? 'bg-[#0066CC] text-white border-[#0066CC]'
                : 'text-slate-700 border-[#E5E5E5] hover:bg-slate-50'
            }`}
          >
            <Filter size={15} />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="px-6 py-5 border-b border-[#E5E5E5] bg-slate-50/50">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Filter Logs</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Action Type</label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] bg-white"
                >
                  {ACTION_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Actor Role</label>
                <select
                  value={actorRole}
                  onChange={(e) => setActorRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] bg-white"
                >
                  {ACTOR_ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-sm text-red-500">
            Failed to load logs
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                {['ACTION', 'ACTOR', 'TARGET', 'TIMESTAMP'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} className="border-b border-[#E5E5E5] last:border-0 hover:bg-slate-50 transition-colors">

                  {/* ACTION */}
                  <td className="px-4 py-4 w-[40%]">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        <ActionIcon action={log.action.name} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{log.action.name}</p>
                        <CategoryBadge category={log.action.type} />
                        {log.action.reason && log.action.reason !== 'No reason provided' && (
                          <p className="text-xs text-slate-400 mt-1">
                            Reason: {log.action.reason}
                          </p>
                        )}
                        {log.action.message && (
                          <p className="text-xs text-slate-400 mt-0.5">{log.action.message}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* ACTOR */}
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-slate-900">{log.actor.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <ActorIcon role={log.actor.role} />
                      <span className="text-xs text-slate-400">{log.actor.role}</span>
                    </div>
                  </td>

                  {/* TARGET */}
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-slate-900">{log.target.name}</p>
                    <p className="text-xs text-slate-400">{log.target.type}</p>
                  </td>

                  {/* TIMESTAMP */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <p className="text-sm text-slate-900">{log.timestamp.date}</p>
                    <p className="text-xs text-slate-400">{log.timestamp.time}</p>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#E5E5E5]">
          <span className="text-sm text-slate-500">
            Showing {filtered.length} of {stats.total_logs || 0} logs
          </span>
        </div>

      </div>
    </div>
  )
}