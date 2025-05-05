import React from "react";

const HowItWorks = () => {
  return (
    <section className="py-20 mt-2 h-screen bg-blue-200 " id="how-it-works">
      <div className="w-full max-w-screen-xl mx-auto text-center px-4">
        <h2 className="text-4xl font-bold text-[#4169E1]">How It Works</h2>
        <p className="mt-4 text-lg text-black">
          Our streamlined process makes gathering insights simple and effective
        </p>

        <div className="mt-12 flex flex-col items-start space-y-12 px-4 sm:px-12 md:px-20 relative lg:ml-80">
          {[
            "Submit Responses via Sliders",
            "Admin Review",
            "AI Analysis",
            "Actionable Feedback",
          ].map((title, i) => (
            <div key={i} className="flex items-start relative pl-20">
              <div className="absolute left-0 top-0 flex flex-col items-center">
                <div className="bg-[#4169E1] text-white rounded-xl w-12 h-12 flex items-center justify-center z-10">
                  <span className="text-xl font-semibold">{i + 1}</span>
                </div>
                {i < 3 && (
                  <div className="w-1 bg-[#4169E1] flex-grow mt-0.5"></div>
                )}
              </div>

              <div className="ml-6 flex flex-col items-start">
                <h3 className="font-semibold text-xl text-black">{title}</h3>
                <p className=" text-gray-600 text-left max-w-md ">
                  {
                    [
                      "Users provide feedback using intuitive slider controls ranging from -3 to +3 with context labels.",
                      "Administrators access, filter, and manage responses through a secure dashboard.",
                      "Our AI processes slider responses according to the predefined matrix of recommendations.",
                      "Receive intelligent insights that improve over time with additional training on your email.",
                    ][i]
                  }
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
