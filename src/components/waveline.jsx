import React from "react";

const WaveLine = ({ flip = false }) => {
  return (
    <svg
      viewBox="0 0 1440 100"
      className={`w-full h-auto ${flip ? "rotate-180" : ""}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="
          M0,60 
          C200,40 300,80 400,60 
          C500,40 600,70 700,50 
          C750,40 770,55 780,60 
          C790,65 800,55 810,60 
          C820,65 830,55 840,60 
          C850,65 860,55 870,60 
          C1000,70 1200,40 1440,60"
        fill="none"
        stroke="#1F3B2C"
        strokeWidth="2"
      />
    </svg>
  );
};

export default WaveLine;
