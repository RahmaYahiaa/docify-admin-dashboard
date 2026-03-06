import { Stethoscope, Heart, User, Shield } from 'lucide-react'

const ROLE_CONFIG = {
  doctor: {
    style: 'bg-blue-50 text-blue-700 border border-blue-200',
    icon: Stethoscope,
  },
  patient: {
    style: 'bg-green-50 text-green-700 border border-green-200',
    icon: Heart,
  },
  assistant: {
    style: 'bg-purple-50 text-purple-700 border border-purple-200',
    icon: User,
  },
  admin: {
    style: 'bg-red-50 text-red-700 border border-red-200',
    icon: Shield,
  },
  'super admin': {
    style: 'bg-red-50 text-red-700 border border-red-200',
    icon: Shield,
  },
}

export default function RoleBadge({ role }) {
  const key = role?.toLowerCase()
  const config = ROLE_CONFIG[key] || {
    style: 'bg-slate-100 text-slate-600',
    icon: User,
  }
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.style}`}>
      <Icon size={11} />
      {role}
    </span>
  )
}