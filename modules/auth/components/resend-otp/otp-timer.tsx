"use client";
import { ClockIcon } from "lucide-react";

const OtpTimer = ({ time }: { time: number }) => {
  return (
    <div className="flex items-center gap-2 w-full justify-center">
      <ClockIcon />
      <p>0:{time}</p>
    </div>
  );
};

export default OtpTimer;
