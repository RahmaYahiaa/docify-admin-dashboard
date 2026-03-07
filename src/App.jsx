import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import DoctorVerificationPage from '@/pages/doctorVerification/DoctorVerificationPage'
import DoctorVerificationDetailsPage from '@/pages/doctorVerification/DoctorVerificationDetailsPage'
import SpecialtiesPage from '@/pages/specialties/SpecialtiesPage'
import UsersPage from '@/pages/users/UsersPage'
import AppointmentsPage from '@/pages/appointments/AppointmentsPage'
import PaymentsPage from '@/pages/payments/PaymentsPage'
const Placeholder = ({ name }) => (
  <div className="flex items-center justify-center h-64">
    <span className="text-2xl font-semibold text-slate-400">{name} — Coming Soon</span>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/*"
          element={
            <PageLayout>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/doctor-verification" element={<DoctorVerificationPage />} />
                <Route path="/doctor-verification/:id" element={<DoctorVerificationDetailsPage />} />
                <Route path="/specialties" element={<SpecialtiesPage />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/logs" element={<Placeholder name="Logs" />} />
                <Route path="/settings" element={<Placeholder name="Settings" />} />
              </Routes>
            </PageLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}