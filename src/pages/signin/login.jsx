import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import AuthImage from "../../components/authImage/AUTHImage";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await login({ email, password });
      localStorage.setItem("token", res.data.access_token);

      if (remember) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      navigate("/questionnaire");
    } catch (err) {
      const message = err.response?.data?.detail;
      if (message === "Invalid email or password") {
        setError("Invalid email or password.");
      } else if (message === "User not found") {
        setError("No user exists with this email.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-['Readex_Pro'] ">
      <form
        className="w-full md:w-1/2 flex flex-col justify-center px-6 max-w-md mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-black mb-2 "style={{ fontFamily: "Montserrat", fontWeight: 600 }}
        >
          
          Sign In to Your Account
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm ">
          Please enter details to login to your account
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center text-sm font-medium border border-red-400">
            {error}
          </div>
        )}

        <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="w-full mb-4 p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 bg-green-50"
        />

        <label className="text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 pr-10 bg-green-50"
          />
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-600 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <label className="flex items-center text-sm text-gray-700 cursor-pointer relative">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="peer w-4 h-4 mr-2 appearance-none border border-gray-500 rounded-sm bg-white checked:bg-gray-400 checked:border-gray-500 cursor-pointer"
            />

            <svg
              className="absolute left-[2px] top-[2px] w-3 h-3 text-white pointer-events-none hidden peer-checked:block"
              fill="none"
              viewBox="0 0 23 23"
              stroke="currentColor"
              strokeWidth="4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-800">Remember password</span>
          </label>

          <Link to="/forgot" className="text-sm text-gray-700 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full text-white py-3 rounded-md text-lg font-semibold transition cursor-pointer hover:brightness-90"
          style={{ backgroundColor: "#548B51" }}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center font-readex ">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Logging in...
            </div>
          ) : (
            "Sign In"
          )}
        </button>

        <div className="flex justify-center items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <p className="text-center text-sm text-gray-600">
          Do not have an account?{" "}
          <Link
            to="/signup"
            className="text-[#548B51] font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </form>

      <div className="hidden md:flex w-1/2 items-center justify-center h-screen">
        <AuthImage />
      </div>
    </div>
  );
}
