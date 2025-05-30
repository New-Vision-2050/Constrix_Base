import React from "react";

const PersonLockIcon = ({ ...props }) => {
  return (
    <svg
      width="18"
      height="21"
      viewBox="0 0 18 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 13V15C4.68629 15 2 17.6863 2 21H0C0 16.5817 3.58172 13 8 13ZM8 12C4.685 12 2 9.315 2 6C2 2.685 4.685 0 8 0C11.315 0 14 2.685 14 6C14 9.315 11.315 12 8 12ZM8 10C10.21 10 12 8.21 12 6C12 3.79 10.21 2 8 2C5.79 2 4 3.79 4 6C4 8.21 5.79 10 8 10ZM17 16H18V21H10V16H11V15C11 13.3431 12.3431 12 14 12C15.6569 12 17 13.3431 17 15V16ZM15 16V15C15 14.4477 14.5523 14 14 14C13.4477 14 13 14.4477 13 15V16H15Z"
      />
    </svg>
  );
};

export default PersonLockIcon;
