import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WaveLine from "../components/waveline";
const Intro = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const handlePopState = () => {
      if (!window.location.hash) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      }
    };

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
      className="relative w-full h-screen flex items-center justify-center overflow-hidden font-[Readex_Pro]"
    >
      <div className="relative z-10 text-center max-w-3xl px-4 text-black">
        <h2
          className="text-3xl sm:text-4xl drop-shadow-md"
          style={{ fontFamily: "Montserrat", fontWeight: 600 }}
        >
          AI-Powered Questionnaire & Feedback System
        </h2>
        <p className="mt-4 text-base sm:text-lg drop-shadow-md">
          Transform your data collection and analysis with our intelligent feedback system.
          Get actionable insights and improve decision-making.
        </p>
      </div>
      
       <div className="absolute bottom-0 left-0 right-0">
        <WaveLine />
      </div>
    </section>
  );
};

export default Intro;
