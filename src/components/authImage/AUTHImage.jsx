import React, { useState } from "react";
import authimage from "../../../assets/frame1.svg";
import content from "../../constants/content";

export default function AuthImage() {
  const descriptions = [
    content.appDescription,
   
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div
      className="flex relative w-[100%] h-[100%] items-center justify-center bg-cover bg-center sm:hidden md:flex"
      style={{ backgroundImage: `url(${authimage})` }}
    >
      <div className="text-white flex flex-col items-center justify-center text-center w-[55%] mt-85 ml-50">
        <h2 className="font-['Roboto'] font-bold text-xl">{content.appName}</h2>

        <div className="my-4"></div>

        <p className="font-['Roboto'] w-76 text-center font-normal lg:mb-[45px] md:mb-[50px] mb-20 text-[18px] leading-[24px] tracking-[0%]">
          {descriptions[currentIndex]}
        </p>

        <div className="flex space-x-2 mb-100">
        {descriptions.length > 1 && (
  <div className="flex space-x-2 mb-100">
    {descriptions.map((_, index) => (
      <div
        key={index}
        onClick={() => setCurrentIndex(index)}
        className={`w-[30px] h-[4px] rounded-[20px] cursor-pointer transition-all ${
          currentIndex === index ? "bg-white" : "bg-gray-500"
        }`}
      ></div>
    ))}
  </div>
)}

        </div>
      </div>
    </div>
  );
}
