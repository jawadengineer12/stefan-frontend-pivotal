import React, { useState, useEffect } from 'react';
import { resendOtp } from '../../api/auth.js';
import { useNavigate } from 'react-router-dom';

const OTPVerification = () => {
  const [code, setCode] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail");

  useEffect(() => {
    if (!email) {
      alert("No email found. Please go back and request OTP again.");
      navigate("/forgot");
    }
  }, [email, navigate]);

  const handleContinue = () => {
    if (!code.trim()) {
      alert("Please enter the OTP code.");
      return;
    }

    localStorage.setItem("resetOtp", code);
    navigate("/resetpassword");
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp(email);
      setResendMessage("OTP has been resent to your email.");
      setTimeout(() => setResendMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to resend OTP.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
      <p className="mb-2">Code sent to: <strong>{email}</strong></p>
      <input
        type="text"
        placeholder="Enter OTP"
        className="mb-4 border p-2 text-black"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        onClick={handleContinue}
        className="bg-black text-white px-4 py-2 rounded w-[200px] mb-3"
      >
        Continue
      </button>
      <button
        onClick={handleResendOtp}
        className="text-blue-600 underline text-sm"
      >
        Resend OTP
      </button>
      {resendMessage && (
        <p className="text-blue-600 text-sm mt-2">{resendMessage}</p>
      )}
    </div>
  );
};

export default OTPVerification;
