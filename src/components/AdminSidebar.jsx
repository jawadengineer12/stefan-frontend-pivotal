import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const AdminSidebar = ({ sidebarVisible, setSidebarVisible }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      
      <button
        className="block lg:hidden fixed top-4 left-4 z-50 bg-black p-2 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <FiX className="text-white" size={24} />
        ) : (
          <FiMenu className="text-white" size={24} />
        )}
      </button>

      <aside
        className={`bg-blue-800 text-white fixed top-0 left-0 h-screen flex flex-col justify-between p-6 z-40 shadow-md transition-all duration-300 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 ${sidebarVisible ? "lg:w-64" : "lg:w-0 lg:-translate-x-full"}`}
      >
        {sidebarVisible && (
          <>
            <div className="flex flex-col space-y-4 mt-8">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
               <button
                onClick={() => handleNavClick("/admin/dashboard/company")}
                className="text-left hover:bg-blue-600 px-4 py-2 rounded cursor-pointer"
              >
                Manage Companies
              </button>
              <button
                onClick={() => handleNavClick("/admin/dashboard/create-question")}
                className="text-left hover:bg-blue-600 px-4 py-2 rounded cursor-pointer"
              >
                Configure Sections / Questions
              </button>
             
              <button
                onClick={() => handleNavClick("/admin/dashboard/get-questions")}
                className="text-left hover:bg-blue-600 px-4 py-2 rounded cursor-pointer"
              >
                See all Responses
              </button>

              <button
                onClick={() => handleNavClick("/admin/dashboard/feedback")}
                className="text-left hover:bg-blue-600 px-4 py-2 rounded cursor-pointer"
              >
                Generate Pipo Report
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white mt-6 px-4 py-2 rounded cursor-pointer"
            >
              Logout
            </button>
          </>
        )}
      </aside>
    </>
  );
};

export default AdminSidebar;
