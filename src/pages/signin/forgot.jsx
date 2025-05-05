import React, { useState } from "react";
import { forgotPassword } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import AuthImage from "../../components/authImage/AUTHImage";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await forgotPassword(JSON.stringify(email));
      alert("OTP sent to email");
      localStorage.setItem("resetEmail", email);
      navigate("/otpverification");
    } catch (err) {
      alert(err.response?.data?.detail || "Error sending OTP");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center overflow-hidden">
      <div className="w-[400px] ml-45">
        <h2 className="text-xl font-bold mb-2 text-blue-500">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border rounded-[140px] text-black"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white p-3 rounded-[140px]"
        >
          Send OTP
        </button>
      </div>

      <div className="hidden md:flex w-1/2 items-center justify-center h-screen ml-92">
        <AuthImage />
      </div>
    </div>
  );
};

export default Forgot;
