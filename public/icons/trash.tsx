import { SVGProps } from "react";

const TrashIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="13"
      fill="none"
      viewBox="0 0 10 13"
      {...props}
    >
      <path
        fill="#E95935"
        d="M7.425 4.643h-5.36v6.717h5.36zM6.416.607l.694.662h2.333v1.356H.046V1.27H2.38l.693-.662zm2.365 2.68v8.073c0 .757-.6 1.356-1.356 1.356h-5.36c-.758 0-1.357-.599-1.357-1.356V3.287z"
      ></path>
    </svg>
  );
};

export default TrashIcon;
