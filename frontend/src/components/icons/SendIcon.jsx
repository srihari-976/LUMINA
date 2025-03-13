import React from 'react';

const SendIcon = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="rgbGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="red">
            <animate attributeName="stop-color" values="red; yellow; green; cyan; blue; magenta; red" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="blue">
            <animate attributeName="stop-color" values="blue; magenta; red; yellow; green; cyan; blue" dur="4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <path
        d="M3 12H9L12 7L15 17L18 12H21"
        stroke="url(#rgbGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SendIcon;
