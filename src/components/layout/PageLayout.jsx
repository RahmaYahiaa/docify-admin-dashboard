import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />
      <main className="ml-[220px] pt-16 p-8">
        {children}
      </main>
    </div>
  )
}