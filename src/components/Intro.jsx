import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../../assets/KeyFeatureImg1.svg";

const Intro = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Confirm on tab close or refresh only
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // Required for Chrome
    };

    // Handle browser back navigation
    const handlePopState = () => {
      // Only log out if navigating back in history, not hash changes
      if (!window.location.hash) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      }
    };

    // Push initial state to detect back button
    window.history.pushState(null, "", window.location.pathname);

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return (
    <section
      id="Introduction"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <img
        src={img1}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Overlay Content */}
      <div className="relative z-10 text-center max-w-3xl px-4 text-white">
        <h2 className="text-3xl sm:text-4xl font-bold drop-shadow-md">
          AI-Powered Questionnaire & Feedback System
        </h2>
        <p className="mt-4 text-base sm:text-lg drop-shadow-md">
          Transform your data collection and analysis with our intelligent feedback system.
          Get actionable insights and improve decision-making.
        </p>
      </div>
    </section>
  );
};

export default Intro;
