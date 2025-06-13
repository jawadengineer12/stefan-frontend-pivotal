import React, { useState } from "react";
import { forgotPassword } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import AuthImage from "../../components/authImage/AUTHImage";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      setSuccessMsg("✅ OTP sent successfully to your email.");
      setErrorMsg("");
      localStorage.setItem("resetEmail", email);
      setTimeout(() => navigate("/otpverification"), 2000);
    } catch (err) {
      setSuccessMsg("");
      setErrorMsg(err.response?.data?.detail || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden font-['Readex']">
      {/* Left Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <h2 className="text-[32px] font-bold mb-4 text-green-500">Forgot Password</h2>

          {successMsg && (
            <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-2 rounded mb-3 text-sm">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded mb-3 text-sm">
              {errorMsg}
            </div>
          )}

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 border rounded-[140px] text-black bg-green-50"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-green-500 text-white p-3 rounded-[140px] flex items-center justify-center cursor-pointer hover:bg-green-600"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <AuthImage />
      </div>
    </div>
  );
};

export default Forgot;
