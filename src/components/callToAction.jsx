import { useNavigate } from "react-router-dom";
import WaveLine from "./Waveline";

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section
      id="call-to-action"
      className="relative bg-white text-center text-black font-[Readex_Pro] w-full overflow-hidden"
    >
      {/* Main content with tighter spacing */}
      <div className="px-4 pt-8 pb-12 max-w-screen-xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
          style={{ fontFamily: "Montserrat", fontWeight: 600 }}
        >
          Ready to transform your feedback process?
        </h2>
        <p className="text-sm sm:text-base mb-6">
          Start collecting smarter insights today with our slider-based AI questionnaire system
        </p>
        <button
          onClick={() => navigate("/questionnaire")}
          className="text-white px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer hover:brightness-90"
          style={{ backgroundColor: "#548B51" }}
        >
          Start Questionnaire
        </button>
      </div>

     
      <div className="w-full">
        <WaveLine flip />
      </div>
    </section>
  );
};

export default CallToAction;
