import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import DoctorVerificationPage from '@/pages/doctorVerification/DoctorVerificationPage'
import DoctorVerificationDetailsPage from '@/pages/doctorVerification/DoctorVerificationDetailsPage'
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
                <Route path="/specialties" element={<Placeholder name="Doctor Specialties" />} />
                <Route path="/appointments" element={<Placeholder name="Appointments" />} />
                <Route path="/payments" element={<Placeholder name="Payments" />} />
                <Route path="/users" element={<Placeholder name="Users" />} />
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