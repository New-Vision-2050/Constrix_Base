"use client";
import { useCountDown } from "@/hooks/use-countdown";
import { useEffect } from "react";
import OtpTimer from "./otp-timer";
import AutoHeight from "@/components/animation/auto-height";
import ResendOtp from "./resend-otp";

const OtpHub = ({
  identifier,
  resendFor,
  token,
}: {
  identifier: string;
  resendFor: "resend-otp" | "forget-password";
  token: string;
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
          token={token}
        />
      </AutoHeight>
    </div>
  );
};

export default OtpHub;
