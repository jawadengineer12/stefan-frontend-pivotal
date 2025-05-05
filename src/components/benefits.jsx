import React from "react";
import slider from "../../assets/slider.svg";

const Benefits = () => {
  return (
    <section className="text-black py-20" id="benefits">
      <div className="w-full max-w-screen-xl mx-auto text-center px-4">
        <h2 className="text-4xl font-bold mb-16 sm:mb-20">
          Smart Features, Real Benefits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Data-Driven Decisions",
              desc: "Make informed decisions with actionable data derived from user feedback.",
            },
            {
              title: "Increased Engagement",
              desc: "Engage users more effectively with a dynamic and user-friendly questionnaire.",
            },
            {
              title: "Self-Hosted & Secure",
              desc: "Own and protect your data. Deploy on Swiss servers for privacy.",
            },
            {
              title: "Customizable Framework",
              desc: "Tailored AI feedback aligned with your specific requirements.",
            },
          ].map((benefit, i) => (
            <div
              key={i}
              className="bg-blue-100 p-6 rounded-lg shadow-lg flex items-start sm:items-center"
            >
              <img src={slider} alt="Slider" className="w-10 h-10 mr-4" />
              <div className="text-left">
                <h3 className="text-2xl font-semibold text-black">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-gray-600">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
