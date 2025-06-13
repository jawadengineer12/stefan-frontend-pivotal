import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section
      className="bg-[#4169E1] py-20 text-white text-center"
      id="call-to-action"
    >
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-4">
          Ready to transform your feedback process?
        </h2>
        <p className="text-lg mb-8">
          Start collecting smarter insights today with our slider-based AI
          questionnaire system
        </p>
        <button
          onClick={() => navigate("/questionnaire")}
          className="bg-white text-[#4169E1] px-6 py-3 rounded-lg font-semibold transition-all hover:bg-green-100 cursor-pointer"
        >
          Start Questionnaire
        </button>
      </div>
    </section>
  );
};

export default CallToAction;
