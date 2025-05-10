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
    <header className="bg-white text-blue-600 p-4 shadow-md fixed top-0 w-full z-50 md:justify-between">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="text-2xl font-bold cursor-pointer">QuestAire</div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 items-center text-black text-base lg:text-lg">
          <a
            href="#Introduction"
            className="hover:text-blue-500 cursor-pointer"
          >
            Introduction
          </a>
          <a href="#KeyFeatures" className="hover:text-blue-500 cursor-pointer">
            Key Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-blue-500 cursor-pointer"
          >
            How It Works
          </a>
          <span
            onClick={() => navigate("/questionnaire")}
            className="hover:text-blue-500 cursor-pointer"
          >
            Questionnaire
          </span>
        </nav>

        <div className="hidden md:flex space-x-2 ml-20">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 cursor-pointer"
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
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
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
