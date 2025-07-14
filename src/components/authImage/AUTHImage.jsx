import React, { useState } from "react";
import authimage from "../../../assets/frame1.svg";
import content from "../../constants/content";

export default function AuthImage() {
  const descriptions = [content.appDescription];
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div
      className="flex relative w-[500PX] h-full items-center justify-center bg-white sm:hidden md:flex"
      style={{ backgroundImage: `url(${authimage})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}
    >
      {/* Overlay container for app name and description */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center w-full px-4">
        <h2 className="font-semibold text-xl text-black"
        style={{ fontFamily: "Montserrat", fontWeight: 600 }}>
          {content.appName}
        </h2>
        <p className="font-['Readex_Pro'] mt-2 text-black text-sm max-w-md mx-auto">
          {descriptions[currentIndex]}
        </p>
      </div>
    </div>
  );
}
