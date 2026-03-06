import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Sidebar />
      <Navbar />
      <main className="ml-[256px] pt-16 p-6">
        {children}
      </main>
    </div>
  )
}