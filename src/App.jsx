import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'

import AuthGuard from '@/components/auth/AuthGuard'
import PageLayout from '@/components/layout/PageLayout'
import LoginPage from '@/pages/auth/LoginPage'

import DashboardPage from '@/pages/dashboard/DashboardPage'
import DoctorVerificationPage from '@/pages/doctorVerification/DoctorVerificationPage'
import DoctorVerificationDetailsPage from '@/pages/doctorVerification/DoctorVerificationDetailsPage'
import SpecialtiesPage from '@/pages/specialties/SpecialtiesPage'
import UsersPage from '@/pages/users/UsersPage'
import AppointmentsPage from '@/pages/appointments/AppointmentsPage'
import PaymentsPage from '@/pages/payments/PaymentsPage'
import LogsPage from '@/pages/logs/LogsPage'
import SettingsPage from '@/pages/settings/SettingsPage'

function ProtectedLayout() {
  return (
    <AuthGuard>
      <PageLayout />
    </AuthGuard>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>

        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/doctor-verification" element={<DoctorVerificationPage />} />
          <Route path="/doctor-verification/:id" element={<DoctorVerificationDetailsPage />} />
          <Route path="/specialties" element={<SpecialtiesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/logs" element={<LogsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  )
}