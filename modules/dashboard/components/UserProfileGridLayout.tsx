import React from "react";

type PropsT = {
  left: React.ReactNode;
  right: React.ReactNode;
};

export default function UserProfileGridLayout({ left, right }: PropsT) {
  return (
    <div className="w-full flex flex-col sm:flex-row">
      {/* Right Side (4 columns on sm and up) */}
      <div className="w-full flex-grow sm:w-4/12  p-4 items-center justify-center">
        {right}
      </div>

      {/* Left Side (8 columns on sm and up) */}
      <div className="w-full flex-grow sm:w-8/12  p-4 items-center justify-center">
        {left}
      </div>
    </div>
  );
}
