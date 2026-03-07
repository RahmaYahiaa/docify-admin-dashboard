export default function StatsCard({ title, value, icon: Icon, iconColor, children }) {
  return (
    <div className="bg-white rounded-[10px] border border-[#E5E5E5] px-[17px] py-[17px]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {children && <div className="mt-1">{children}</div>}
        </div>
        {Icon && (
          <div className={`${iconColor} opacity-80`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  )
}