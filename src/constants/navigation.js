import {
  LayoutDashboard,
  UserCheck,
  Stethoscope,
  Calendar,
  CreditCard,
  Users,
  ClipboardList,
  Settings,
} from 'lucide-react'

export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Doctor Verification',
    path: '/doctor-verification',
    icon: UserCheck,
  },
  {
    label: 'Doctor Specialties',
    path: '/specialties',
    icon: Stethoscope,
  },
  {
    label: 'Appointments',
    path: '/appointments',
    icon: Calendar,
  },
  {
    label: 'Payments',
    path: '/payments',
    icon: CreditCard,
  },
  {
    label: 'Users',
    path: '/users',
    icon: Users,
  },
  {
    label: 'Logs',
    path: '/logs',
    icon: ClipboardList,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
  },
]