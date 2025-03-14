import React, { SVGProps } from "react";

const EnterIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      fill="none"
      viewBox="0 0 13 13"
      {...props}
    >
      <path
        fill="#F42588"
        d="M5.648 5.715v-1.75l2.917 2.333-2.917 2.334v-1.75H.398V5.715zm-4.4 2.333h1.24a4.668 4.668 0 0 0 8.994-1.75 4.667 4.667 0 0 0-8.994-1.75h-1.24a5.833 5.833 0 1 1 0 3.5"
      ></path>
    </svg>
  );
};

export default EnterIcon;
