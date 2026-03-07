import { Users, UserCheck, Calendar, DollarSign, RefreshCw } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import DashboardStatsCard from '@/components/shared/DashboardStatsCard'
import { dashboardStats } from '@/features/dashboard/data/dashboardMockData'

export default function DashboardPage() {
  const stats = dashboardStats

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
          value={stats.totalDoctors}
          icon={UserCheck}
          iconColor="text-blue-500"
        >
          <div className="flex items-center gap-6 text-sm">
            <span>
              Verified{' '}
              <span className="font-semibold text-green-600">
                {stats.verifiedDoctors}
              </span>
            </span>
            <span>
              Pending{' '}
              <span className="font-semibold text-orange-500">
                {stats.pendingDoctors}
              </span>
            </span>
          </div>
        </DashboardStatsCard >

        {/* Total Patients */}
        <DashboardStatsCard 
          title="Total Patients"
          value={stats.totalPatients.toLocaleString()}
          icon={Users}
          iconColor="text-purple-500"
        >
          <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
            <span>↑ +{stats.newPatientsToday} today</span>
          </div>
        </DashboardStatsCard >

        {/* Appointments Today */}
        <DashboardStatsCard 
          title="Appointments Today"
          value={stats.appointmentsToday}
          icon={Calendar}
          iconColor="text-green-500"
        >
          <div className="flex items-center gap-6 text-sm">
            <span>
              Completed{' '}
              <span className="font-semibold text-green-600">
                {stats.completedAppointments}
              </span>
            </span>
            <span>
              Upcoming{' '}
              <span className="font-semibold text-blue-600">
                {stats.upcomingAppointments}
              </span>
            </span>
          </div>
        </DashboardStatsCard >

        {/* Revenue Today */}
        <DashboardStatsCard 
          title="Revenue Today"
          value={`$${stats.revenueToday.toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-green-500"
        >
          <div className="flex items-center gap-6 text-sm">
            <span>
              Cash{' '}
              <span className="font-semibold text-slate-700">
                ${stats.cash.toLocaleString()}
              </span>
            </span>
            <span>
              Card{' '}
              <span className="font-semibold text-slate-700">
                ${stats.card.toLocaleString()}
              </span>
            </span>
          </div>
        </DashboardStatsCard >

        {/* Refunds Today */}
        <DashboardStatsCard 
          title="Refunds Today"
          value={`$${stats.refundsToday}`}
          icon={RefreshCw}
          iconColor="text-orange-500"
        >
          <div className="text-sm text-slate-500">
            Total Transactions{' '}
            <span className="font-semibold text-slate-700">
              {stats.totalTransactions}
            </span>
          </div>
        </DashboardStatsCard >

      </div>
    </div>
  )
}