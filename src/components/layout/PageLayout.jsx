import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function PageLayout() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Sidebar />
      <Navbar />
      <main className="ml-[256px] pt-16 p-6">
        <Outlet />
      </main>
    </div>
  );
}
