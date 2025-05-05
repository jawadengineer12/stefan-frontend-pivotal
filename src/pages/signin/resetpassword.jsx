import React, { useState, useEffect } from "react";
import { resetPassword } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import AuthImage from "../../components/authImage/AUTHImage";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail");
  const code = localStorage.getItem("resetOtp");

  useEffect(() => {
    if (!email || !code) {
      alert("Missing information. Please restart the process.");
      navigate("/forgot");
    }
  }, [email, code, navigate]);

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await resetPassword({ email, code, new_password: newPassword });
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOtp");
      navigate("/resetsuccess");
    } catch (err) {
      alert(err.response?.data?.detail || "Reset failed");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden">
      <div className="flex justify-center items-center w-full lg:w-1/2 p-6">
        <div className="w-full max-w-[400px]">
          <h1 className="text-xl font-bold mb-16 text-blue-500 text-center">Reset Password</h1>

          <div className="relative mb-6">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border rounded-[140px] text-black pr-10"
            />
            <div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FiEyeOff /> : <FiEye />}
            </div>
          </div>

          <div className="relative mb-6">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            className="w-full bg-blue-500 text-white p-3 rounded-[140px]"
          >
            Reset Password
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
