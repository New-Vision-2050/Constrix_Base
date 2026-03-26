import React from "react";

const PersonLoudIcon = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="none"
      viewBox="0 0 22 22"
      {...props}
    >
      <path
        d="M0 22a8 8 0 1 1 16 0h-2a6 6 0 0 0-12 0zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6m0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4M20.548.783A13.94 13.94 0 0 1 22 7c0 2.233-.523 4.343-1.452 6.216l-1.645-1.196A11.96 11.96 0 0 0 20 7c0-1.792-.393-3.493-1.097-5.02zm-3.302 2.401A10 10 0 0 1 18 7a10 10 0 0 1-.754 3.815l-1.677-1.22A8 8 0 0 0 16 7a8 8 0 0 0-.43-2.596z"
      ></path>
    </svg>
  );
};

export default PersonLoudIcon;
