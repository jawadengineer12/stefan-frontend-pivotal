import React, { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header className="bg-white text-[#548B51] p-4 shadow-md fixed top-0 w-full z-50 md:justify-between font-[Readex_Pro]">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="text-2xl font-bold cursor-pointer text-[#548B51]">QuestAire</div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 items-center text-black text-base lg:text-lg">
          <a
            href="#Introduction"
            className="hover:text-[#548B51] cursor-pointer"
          >
            Introduction
          </a>
          <a href="#KeyFeatures" className="hover:text-[#548B51] cursor-pointer">
            Key Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[#548B51] cursor-pointer"
          >
            How It Works
          </a>
          <span
            onClick={() => navigate("/questionnaire")}
            className="hover:text-[#548B51] cursor-pointer"
          >
            Questionnaire
          </span>
        </nav>

        <div className="hidden md:flex space-x-2 ml-20">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className=" text-white px-4 py-1 rounded hover:brightness-90 cursor-pointer"
            style={{ backgroundColor: "#C40000" }}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className=" text-white px-4 py-1 rounded cursor-pointer hover:brightness-90"
              style={{ backgroundColor: "#548B51" }}
            >
              Login
            </button>
          )}
        </div>

        <button
          className="md:hidden text-black focus:outline-none cursor-pointer"
          onClick={toggleMenu}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-black text-white px-6 py-4 space-y-4">
          <a href="#Introduction" className="block cursor-pointer">
            Introduction
          </a>
          <a href="#KeyFeatures" className="block cursor-pointer">
            Key Features
          </a>
          <a href="#how-it-works" className="block cursor-pointer">
            How It Works
          </a>
          <span
            onClick={() => {
              setIsOpen(false);
              navigate("/questionnaire");
            }}
            className="block cursor-pointer"
          >
            Questionnaire
          </span>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full text-white px-4 py-2 rounded cursor-pointer hover:brightness-90"
              style={{ backgroundColor: "#548B51" }}
            >
              Login
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

