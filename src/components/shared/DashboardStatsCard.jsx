export default function DashboardStatsCard({ title, value, icon: Icon, iconColor = 'text-blue-600', children }) {
  return (
    <div className="bg-white rounded-[10px] border border-[#E5E5E5] p-4 sm:p-6 flex items-start justify-between">
      <div className="flex flex-col gap-3 flex-1 min-w-0">
        <div className={`${iconColor}`}>
          <Icon size={28} strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        {children && <div className="mt-1">{children}</div>}
      </div>
    </div>
  )
}