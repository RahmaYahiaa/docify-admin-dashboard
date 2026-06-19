export default function StatsCard({ title, value, icon: Icon, iconColor, children }) {
  return (
    <div className="bg-white rounded-[10px] border border-[#E5E5E5] px-3 py-3 sm:px-[17px] sm:py-[17px]">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-slate-500 mb-1 truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-slate-900">{value}</p>
          {children && <div className="mt-1">{children}</div>}
        </div>
        {Icon && (
          <div className={`${iconColor} opacity-80 shrink-0`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  )
}