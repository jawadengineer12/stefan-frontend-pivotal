import React, { useState, useEffect } from 'react';
import { resendOtp, verifyOtp } from '../../api/auth.js';
import { useNavigate } from 'react-router-dom';
import AuthImage from '../../components/authImage/AUTHImage';

const OTPVerification = () => {
  const [code, setCode] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  useEffect(() => {
    if (!email) {
      alert("No email found. Please go back and request OTP again.");
      navigate("/forgot");
    }
  }, [email, navigate]);

  const handleContinue = async () => {
    if (!code.trim()) {
      setErrorMessage("Please enter the OTP code.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await verifyOtp({ email, code }); // ✅ server-side verification
      localStorage.setItem("resetOtp", code);
      navigate("/resetpassword");
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp(email);
      setResendMessage("OTP has been resent to your email.");
      setTimeout(() => setResendMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || "Failed to resend OTP.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen justify-center items-center overflow-hidden font-['Readex']">
      <div className="w-full md:w-[385px] h-screen flex justify-center items-center px-4">
        <div className="w-full max-w-md md:ml-20 mx-auto flex flex-col items-center">
          <h2 className="text-[34px] font-bold mb-6 text-green-500">Verify OTP</h2>
          <p className="mb-3 text-sm text-gray-700">Code sent to: <strong>{email}</strong></p>

          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full mb-2 p-3 border rounded-[140px] text-black"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          {errorMessage && (
            <p className="text-red-600 text-sm mb-2">{errorMessage}</p>
          )}

          <button
            onClick={handleContinue}
            className="w-full bg-green-500 text-white p-3 rounded-[140px] mb-3 cursor-pointer flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </>
            ) : (
              "Continue"
            )}
          </button>

          <button
            onClick={handleResendOtp}
            className="text-green-600 underline text-sm cursor-pointer"
          >
            Resend OTP
          </button>

          {resendMessage && (
            <p className="text-green-600 text-sm mt-2">{resendMessage}</p>
          )}
        </div>
      </div>

      <div className="hidden lg:flex h-screen w-[75%] justify-end items-center">
        <div className="h-full w-full">
          <AuthImage />
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
