import React, { useState, useEffect } from "react";
import AuthImage from "../../components/authImage/AUTHImage";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../api/auth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import API_BASE_URL from "../../constants/config";

// ✅ Email validation function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.toLowerCase());
};

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [companies, setCompanies] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signingUp, setSigningUp] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/user/get-companies`);
      setCompanies(res.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!name.trim()) return alert("Name is required");
    if (!email.trim()) return alert("Email is required");
    if (!isValidEmail(email)) return alert("Please enter a valid email address (e.g., example@gmail.com)");
    if (!selectedCompanyId) return alert("Please select a company");
    if (!password) return alert("Password is required");
    if (!confirmPassword) return alert("Please confirm your password");
    if (password !== confirmPassword) return alert("Passwords do not match");

    try {
      setSigningUp(true);
      await signup({ email, password, name, company_id: Number(selectedCompanyId) });
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.detail || "Signup failed");
    } finally {
      setSigningUp(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* ✅ CHANGED THIS DIV to a FORM and added onSubmit handler */}
      <form
        className="w-full md:w-1/2 flex flex-col justify-center px-6 max-w-md mx-auto"
        onSubmit={(e) => {
          e.preventDefault(); // ✅ Prevent default form submission (page reload)
          handleSignup(); // ✅ Trigger custom sign-up logic
        }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-black mb-2">
          Sign Up for an Account
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Please enter details to create your account
        </p>

        <label className="text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full mb-4 p-3 border border-gray-300 rounded-md text-black placeholder-gray-500"
          required
        />

        <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="w-full mb-4 p-3 border border-gray-300 rounded-md text-black placeholder-gray-500"
          required
        />

        <label className="text-sm font-medium text-gray-700 mb-1 cursor-pointer">Select Company</label>
        <select
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded-md text-black cursor-pointer"
          required
        >
          <option value="">-- Select Company --</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>

        <label className="text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a strong password"
            className="w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 pr-10"
            required
          />
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-600 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <label className="text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <div className="relative mb-6">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            className="w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 pr-10"
            required
          />
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-600 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <button
          type="submit" 
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
          disabled={signingUp}
        >
          {signingUp ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Signing Up...
            </div>
          ) : (
            "Sign Up"
          )}
        </button>

        <div className="flex justify-center items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            Login
          </Link>
        </p>
      </form>

      <div className="hidden md:flex w-1/2 items-center justify-center">
        <AuthImage />
      </div>
    </div>
  );
}
