import React, { useState } from "react";
import { resetPassword } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import AuthImage from "../../components/authImage/AUTHImage";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ⛔ No error if missing, just fallback to ""
  const email = localStorage.getItem("resetEmail") || "";
  const code = localStorage.getItem("resetOtp") || "";

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email, code, new_password: newPassword });
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOtp");
      navigate("/resetsuccess");
    } catch (err) {
      alert(err.response?.data?.detail || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleReset();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden font-['Readex']">
      <div className="w-full lg:w-1/2 h-screen flex justify-center items-center px-4">
        <div className="w-full max-w-[400px] mx-auto flex flex-col items-center">
          <h1 className="text-[32px] font-bold mb-12 text-green-500 text-center">Reset Password</h1>

          <div className="relative mb-6 w-full">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full p-3 border rounded-[140px] text-black pr-10"
            />
            <div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FiEyeOff /> : <FiEye />}
            </div>
          </div>

          <div className="relative mb-6 w-full">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full p-3 border rounded-[140px] text-black pr-10"
            />
            <div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full bg-green-500 text-white p-3 rounded-[140px] cursor-pointer flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 items-center justify-center h-screen">
        <AuthImage />
      </div>
    </div>
  );
};

export default ResetPassword;
