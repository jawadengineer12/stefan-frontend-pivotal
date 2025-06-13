import React, { useState, useEffect } from "react";
import AuthImage from "../../components/authImage/AUTHImage";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../api/auth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import API_BASE_URL from "../../constants/config";

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isStrongPassword = (password) => {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
  return strongPasswordRegex.test(password);
};

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companySuggestions, setCompanySuggestions] = useState([]);
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
    if (!isValidEmail(email)) return alert("Please enter a valid email address");
    if (!companyName.trim()) return alert("Company name is required");
    if (!password) return alert("Password is required");
    if (!isStrongPassword(password))
      return alert(
        "Password must be at least 12 characters long and include uppercase, lowercase, number, and special character."
      );
    if (!confirmPassword) return alert("Please confirm your password");
    if (password !== confirmPassword) return alert("Passwords do not match");

    const matchedCompany = companies.find(
      (c) => c.name === companyName.trim()
    );
    if (!matchedCompany) {
      return alert("Company does not exist. Please choose a valid company.");
    }

    try {
      setSigningUp(true);
      await signup({
        email,
        password,
        name,
        company_id: matchedCompany.id,
      });
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.detail || "Signup failed");
    } finally {
      setSigningUp(false);
    }
  };

  const handleCompanyInput = (value) => {
    setCompanyName(value);
    const matches = companies.filter((c) =>
      c.name.toLowerCase().includes(value.toLowerCase())
    );
    setCompanySuggestions(matches.slice(0, 10)); 
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <form
        className="w-full md:w-1/2 flex flex-col justify-center px-6 max-w-md mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          handleSignup();
        }}
      >
        <h2 className="font-['Montserrat'] text-2xl sm:text-3xl font-bold text-center text-black mb-2">
          Sign Up for an Account
        </h2>
        <p className="font-['Readex'] text-center text-gray-600 mb-3 text-sm">
          Please enter details to create your account
        </p>

        <label className="text-sm font-medium text-gray-700 mb-1 font-['Readex']">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="font-['Readex'] w-full mb-4 p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 bg-green-50"
          required
        />

        <label className="font-['Readex'] text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="w-full mb-4 p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 bg-green-50"
          required
        />

        <label className="font-['Readex'] text-sm font-medium text-gray-700 mb-1">Enter Company ID</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => handleCompanyInput(e.target.value)}
          placeholder="Type company name"
          className="font-['Readex'] w-full mb-1 p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 bg-green-50"
          required
        />
        {companyName.trim() !== "" && companySuggestions.length > 0 && (
          <ul className="border border-gray-300 rounded-md mb-4 bg-white shadow-sm">
            {companySuggestions.map((c) => (
              <li
                key={c.id}
                onClick={() => {
                  setCompanyName(c.name);
                  setCompanySuggestions([]);
                }}
                className="font-['Readex'] px-4 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer"
              >
                {c.name}
              </li>
            ))}
          </ul>
        )}

        <label className="font-['Readex'] text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a strong password"
            className="font-['Readex'] w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 pr-10 bg-green-50"
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

        <label className="font-['Readex'] text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <div className="relative mb-6">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            className="font-['Readex'] w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 pr-10 bg-green-50"
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
        <p className="font-['Readex'] text-xs text-gray-500 mb-3 mt-[-17px]">
  Password must be at least 12 characters long and include uppercase, lowercase, number, and special character.
        </p>


        <button
          type="submit"
          className="font-['Readex'] w-full bg-green-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-green-700 transition cursor-pointer"
          disabled={signingUp}
        >
          {signingUp ? (
            <div className="flex items-center justify-center">
              <div className="font-['Readex']w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Signing Up...
            </div>
          ) : (
            "Sign Up"
          )}
        </button>

        <div className="flex justify-center items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm font-['Readex']">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <p className="text-center text-sm text-gray-600 font-['Readex']">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 font-semibold hover:underline cursor-pointer font-['Readex']"
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
