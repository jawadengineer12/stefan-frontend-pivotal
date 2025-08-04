import React, { useState } from "react";
import authimage from "../../../assets/frame1.svg";
import content from "../../constants/content";

export default function AuthImage() {
  const descriptions = [content.appDescription];
  const [currentIndex] = useState(0);

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 bg-white sm:hidden md:flex">
   
      <div className="text-center mb-4">
        <h2
          className="font-semibold text-xl text-black"
          style={{ fontFamily: "Montserrat", fontWeight: 600 }}
        >
          {content.appName}
        </h2>
        <p className="font-['Readex_Pro'] mt-2 text-black text-sm max-w-md mx-auto">
          {descriptions[currentIndex]}
        </p>
      </div>
      <img
        src={authimage}
        alt="Auth Illustration"
        className="w-full max-w-[450px] h-auto object-contain"
      />
    </div>
    
  );
}
