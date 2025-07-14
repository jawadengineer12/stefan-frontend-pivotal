import React from "react";
import WaveLine from "../components/waveline";

const HowItWorks = () => {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-white" id="how-it-works">
      <div className="max-w-screen-xl mx-auto text-center font-[Readex_Pro]">
        <h2
          className="text-3xl sm:text-4xl font-bold text-black"
          style={{ fontFamily: "Montserrat", fontWeight: 600 }}
        >
          How It Works
        </h2>
        <p className="mt-4 text-base sm:text-lg text-black">
          Our streamlined process makes gathering insights simple and effective
        </p>

        {/* Timeline section */}
        <div className="mt-12 flex flex-col items-center space-y-12 max-w-3xl mx-auto ">
          {[
            "Submit Responses via Sliders",
            "Admin Review",
            "AI Analysis",
          ].map((title, i) => (
            <div key={i} className="flex items-start w-full relative pl-14 sm:pl-20">
              {/* Circle Number */}
              <div className="absolute left-0 top-0 flex flex-col items-center lg:ml-28">
                <div className="bg-white border border-black text-black rounded-full w-10 h-10 flex items-center justify-center font-semibold z-10">
                  {i + 1}
                </div>
              </div>

              {/* Content */}
              <div className="ml-4 sm:ml-6 text-left lg:ml-30">
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-1">
                  {title}
                </h3>
                <p className="text-gray-600 max-w-lg text-sm sm:text-base">
                  {
                    [
                      "Users provide feedback using intuitive slider controls ranging from -3 to +3 with context labels.",
                      "Administrators access, filter, and manage responses through a secure dashboard.",
                      "Our AI processes slider responses according to the predefined matrix of recommendations.",
                    ][i]
                  }
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional bottom wave */}
      <div className="mt-16">
        <WaveLine />
      </div>
    </section>
  );
};

export default HowItWorks;
