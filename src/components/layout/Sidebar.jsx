import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '@/constants/navigation'

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-white border-r border-slate-200 flex flex-col z-30">
      
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <span className="text-lg font-bold text-slate-900">Docify Admin</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Version */}
      <div className="px-6 py-4 border-t border-slate-200">
        <span className="text-xs text-slate-400">Docify Admin v1.0</span>
      </div>

    </aside>
  )
}