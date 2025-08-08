import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

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
        className={`bg-[#345A7D] text-white fixed top-0 left-0 h-screen flex flex-col justify-between p-6 z-40 shadow-md transition-all duration-300 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 ${
            sidebarVisible ? "lg:w-64" : "lg:w-0 lg:-translate-x-full"
          }`}
      >
        {sidebarVisible && (
          <>
            <div className="flex flex-col space-y-4 mt-8">
              <h1 className=" text-xl font-bold"style={{ fontFamily: "Montserrat", fontWeight: 600 }}>
                Admin Dashboard
              </h1>
              <button
                onClick={() => handleNavClick("/admin/dashboard/company")}
                className="font-['Readex_Pro'] text-left hover:bg-[#7292af] px-4 py-2 rounded cursor-pointer"
              >
                Manage Companies
              </button>
              <button
                onClick={() =>
                  handleNavClick("/admin/dashboard/create-question")
                }
                className="font-['Readex_Pro'] text-left hover:bg-[#7292af] px-4 py-2 rounded cursor-pointer"
              >
                Configure Sections / Questions
              </button>

              <button
                onClick={() => handleNavClick("/admin/dashboard/get-questions")}
                className="font-[Readex_Pro] text-left hover:bg-[#7292af] px-4 py-2 rounded cursor-pointer"
              >
                See all Responses
              </button>

              <button
                onClick={() => handleNavClick("/admin/dashboard/feedback")}
                className="font-['Readex_Pro'] text-left hover:bg-[#7292af] px-4 py-2 rounded cursor-pointer"
              >
                Generate Pipo Report
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="font-['Readex_Pro'] w-full bg-[#C40000] hover:bg-[#c40101c9] text-white mt-6 px-4 py-2 rounded cursor-pointer"
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
//sidebar
