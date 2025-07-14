import axios from "axios";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AuthImage from "../../components/authImage/AUTHImage";
import API_BASE_URL from "../../constants/config";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAdminLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login/`, {
        email,
        password,
      });

      // Redirect on success
      navigate("/admin/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.detail || "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ✅ CHANGED from <div> to <form> and added onSubmit */}
      <form
        className="w-full md:w-1/2 flex flex-col justify-center px-6 max-w-md mx-auto font-[Readex_Pro]"
        onSubmit={(e) => {
          e.preventDefault(); // ✅ prevent page reload
          handleAdminLogin(); // ✅ trigger login
        }}
      >
        <h2
          className="text-2xl sm:text-3xl font-bold text-center text-black mb-2"
          style={{ fontFamily: "Montserrat", fontWeight: 600 }}
        >
          Admin Login
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Sign in to access the admin dashboard
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center font-medium mb-4">
            {error}
          </div>
        )}

        <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter admin email"
          className="w-full mb-4 p-3 border border-gray-300 rounded-md text-black placeholder-gray-500"
        />

        <label className="text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 pr-10"
          />
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-600 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <button
          type="submit" // ✅ Submit on Enter
          disabled={loading}
          className="w-full text-white py-3 rounded-md text-lg font-semibold transition cursor-pointer"
          style={{ backgroundColor: '#548B51' }}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </button>

        {/* <div className="text-center mt-4">
          <p className="text-sm text-gray-600">OR</p>
           <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-2 text-[#548B51] font-semibold hover:underline cursor-pointer"
          >
            Login as User
          </button> 
        </div> */}
      </form>

      <div className="hidden md:flex w-1/2 items-center justify-center">
        <AuthImage />
      </div>
    </div>
  );
}
