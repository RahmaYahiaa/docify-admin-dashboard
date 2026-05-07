import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A'

  return (
    <header className="fixed top-0 left-[256px] right-0 h-16 bg-white border-b border-[#E5E5E5] z-10 flex items-center justify-end px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#0066CC] rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-white">{initials}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{user?.name || 'Admin'}</p>
            <p className="text-xs text-slate-400">{user?.email || ''}</p>
          </div>
        </div>
        <div className="w-px h-8 bg-[#E5E5E5]" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  )
}