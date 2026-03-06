import { LogOut, User } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-[220px] right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 z-20">
      
      {/* Admin Info */}
      <div className="flex items-center gap-4">
        
        {/* Avatar + Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-900">Admin User</span>
            <span className="text-xs text-slate-500">admin@docify.com</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200" />

        {/* Logout */}
        <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
          <LogOut size={16} />
          Logout
        </button>

      </div>
    </header>
  )
}