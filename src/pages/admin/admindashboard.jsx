import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";

const AdminDashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen width for mobile behavior
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar
        sidebarVisible={sidebarVisible}
        setSidebarVisible={setSidebarVisible}
      />
      <main
        className={`transition-all duration-300 w-full overflow-y-auto bg-white text-black
        ${!isMobile && sidebarVisible ? "md:ml-64" : "ml-0"}`}
      >
        <div className="px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
