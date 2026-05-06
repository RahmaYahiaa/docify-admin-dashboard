import { Users, UserCheck, Calendar, DollarSign, RefreshCw } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import DashboardStatsCard from '@/components/shared/DashboardStatsCard'
import { useDashboard } from '@/hooks/useDashboard'

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          subtitle="Overview of your platform metrics"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-[10px] border border-[#E5E5E5] p-6 h-32 animate-pulse"
            >
              <div className="h-4 bg-slate-100 rounded w-1/2 mb-3" />
              <div className="h-8 bg-slate-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          subtitle="Overview of your platform metrics"
        />
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-red-500">Failed to load dashboard data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your platform metrics"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        {/* Total Doctors */}
        <DashboardStatsCard
          title="Total Doctors"
          value={data.doctors.total}
          icon={UserCheck}
          iconColor="text-blue-500"
        >
          <div className="flex items-center gap-6 text-sm">
            <span>
              Verified{' '}
              <span className="font-semibold text-green-600">
                {data.doctors.verified}
              </span>
            </span>
            <span>
              Pending{' '}
              <span className="font-semibold text-orange-500">
                {data.doctors.pending}
              </span>
            </span>
          </div>
        </DashboardStatsCard>

        {/* Total Patients */}
        <DashboardStatsCard
          title="Total Patients"
          value={data.patients.total.toLocaleString()}
          icon={Users}
          iconColor="text-purple-500"
        />

        {/* Appointments Today */}
        <DashboardStatsCard
          title="Appointments Today"
          value={data.appointments.total}
          icon={Calendar}
          iconColor="text-green-500"
        >
          <div className="flex items-center gap-6 text-sm">
            <span>
              Completed{' '}
              <span className="font-semibold text-green-600">
                {data.appointments.completed}
              </span>
            </span>
            <span>
              Upcoming{' '}
              <span className="font-semibold text-blue-600">
                {data.appointments.upcoming}
              </span>
            </span>
          </div>
        </DashboardStatsCard>

        {/* Revenue Today */}
        <DashboardStatsCard
          title="Revenue Today"
          value={`$${data.revenue.total.toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-green-500"
        >
          <div className="flex items-center gap-6 text-sm">
            <span>
              Cash{' '}
              <span className="font-semibold text-slate-700">
                ${data.revenue.cash.toLocaleString()}
              </span>
            </span>
            <span>
              Card{' '}
              <span className="font-semibold text-slate-700">
                ${data.revenue.card.toLocaleString()}
              </span>
            </span>
          </div>
        </DashboardStatsCard>

        {/* Refunds Today */}
        <DashboardStatsCard
          title="Refunds Today"
          value={`$${data.refunds.amount}`}
          icon={RefreshCw}
          iconColor="text-orange-500"
        >
          <div className="text-sm text-slate-500">
            Total Transactions{' '}
            <span className="font-semibold text-slate-700">
              {data.refunds.transactions_count}
            </span>
          </div>
        </DashboardStatsCard>

      </div>
    </div>
  )
}