"use client";
import { useCountDown } from "@/hooks/useCountDown";
import { useEffect } from "react";
import OtpTimer from "./OtpTimer";
import AutoHeight from "@/components/animation/AutoHeight";
import ResendOtp from "./ResendOTP";

const OtpHub = ({
  identifier,
  resendFor,
}: {
  identifier: string;
  resendFor: "resend-otp" | "forget-password";
}) => {
  const {
    counter: time,
    start: timerStart,
    reset: timerReset,
  } = useCountDown(59);

  useEffect(() => {
    timerStart();
  }, []);

  return (
    <div className="h-6">
      <AutoHeight condition={time > 0}>
        <OtpTimer time={time} />
      </AutoHeight>
      <AutoHeight condition={time === 0}>
        <ResendOtp
          timerReset={timerReset}
          identifier={identifier}
          resendFor={resendFor}
        />
      </AutoHeight>
    </div>
  );
};

export default OtpHub;
