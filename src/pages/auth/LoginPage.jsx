import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const FAKE_CREDENTIALS = {
  email: 'admin@docify.com',
  password: 'admin123',
  user: {
    name: 'Admin User',
    email: 'admin@docify.com',
    role: 'Admin',
  },
}

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')

    if (!form.email.trim()) return setError('Email is required')
    if (!form.password.trim()) return setError('Password is required')

    setLoading(true)

    // Simulate API call delay
    await new Promise((r) => setTimeout(r, 800))

    if (
      form.email === FAKE_CREDENTIALS.email &&
      form.password === FAKE_CREDENTIALS.password
    ) {
      login(FAKE_CREDENTIALS.user, 'fake-token-12345')
      navigate('/dashboard')
    } else {
      setError('Invalid email or password')
    }

    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Docify Admin</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your admin account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[10px] border border-[#E5E5E5] p-8 space-y-5">

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertCircle size={15} className="text-red-500 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@docify.com"
              value={form.email}
              onChange={(e) => {
                setForm((p) => ({ ...p, email: e.target.value }))
                setError('')
              }}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => {
                  setForm((p) => ({ ...p, password: e.target.value }))
                  setError('')
                }}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2.5 pr-10 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
              />
              <button
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={15} />
                Sign In
              </>
            )}
          </button>

          {/* Hint */}
          <div className="bg-slate-50 rounded-lg px-4 py-3">
            <p className="text-xs text-slate-500 font-medium mb-1">Demo Credentials:</p>
            <p className="text-xs text-slate-400">Email: admin@docify.com</p>
            <p className="text-xs text-slate-400">Password: admin123</p>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Docify Admin v1.0
        </p>

      </div>
    </div>
  )
}