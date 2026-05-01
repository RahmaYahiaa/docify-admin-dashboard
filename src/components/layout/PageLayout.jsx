import { Outlet } from "react-router-dom";
import { Monitor } from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function PageLayout() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">

      <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center">
        <Monitor size={48} className="text-slate-300 mb-4" />
        <h2 className="text-lg font-bold text-slate-900 mb-2">
          Desktop Required
        </h2>
        <p className="text-sm text-slate-500">
          This admin dashboard is optimized for desktop use.
          Please open it on a larger screen.
        </p>
      </div>

      <Sidebar />
      <Navbar />
      <main className="ml-[256px] pt-16 p-6">
        <Outlet />
      </main>

    </div>
  );
}