import React from "react";
import img1 from "../../assets/insights.svg";

const KeyFeature = () => {
  return (
    <section id="KeyFeatures" className="bg-white py-20 w-full">

      <div className="w-full max-w-screen-xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-black">Key Features</h2>
        <p className="mt-4 text-lg text-gray-600">
          Our comprehensive solution combines powerful tools for data collection, analysis, and AI-driven feedbacks.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
          {[
            {
              title: "AI-Powered Insights",
              desc: "Generate intelligent feedback based on questionnaire responses using our fine-tuned AI model."
            },
            {
              title: "Intuitive Slider Interface",
              desc: "Slider-based questionnaires with customizable -3 to +3 scales for detailed, user-friendly feedback."
            },
            {
              title: "Privacy-Focused",
              desc: "Your data is protected with top-tier security standards and encrypted infrastructure."
            }
          ].map((feature, index) => (
            <div key={index} className="p-6 bg-blue-100 rounded-lg shadow-xl flex flex-col items-start">
              <div className="flex justify-start items-start mb-4 w-[50px] h-[50px] p-2">
                <img src={img1} alt={feature.title} className="w-full h-full object-contain" />
              </div>
              <h3 className="font-semibold text-xl text-black text-left">{feature.title}</h3>
              <p className="mt-2 text-gray-600 text-left">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeature;