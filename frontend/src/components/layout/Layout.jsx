import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 flex">
      
      {/* Mobile Sidebar (Drawer) */}
      <div 
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isMobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div 
          onClick={() => setIsMobileSidebarOpen(false)} 
          className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm transition-opacity duration-300"
        />
        
        {/* Sidebar Drawer */}
        <div 
          className={`absolute inset-y-0 left-0 w-64 bg-white flex flex-col shadow-xl transition-transform duration-300 transform ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar onClose={() => setIsMobileSidebarOpen(false)} />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-60 h-full shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar onMenuClick={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 px-4 py-5 md:px-6 lg:px-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;