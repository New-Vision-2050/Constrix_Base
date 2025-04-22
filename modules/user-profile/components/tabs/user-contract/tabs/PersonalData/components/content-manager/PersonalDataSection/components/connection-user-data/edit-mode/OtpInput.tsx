import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { SetStateAction, useState } from "react";

type PropsT = {
  otp: string;
  setOtp: React.Dispatch<SetStateAction<string>>;
};
const OtpInput = ({ otp, setOtp }: PropsT) => {
  const [error, setError] = useState<string | null>(null);

  const handleOtpChange = (value: string) => {
    setOtp(value);

    // Example validation
    if (value.length === 5 && !/^\d{5}$/.test(value)) {
      setError("OTP must be 5 digits");
    } else {
      setError(null);
    }
  };

  return (
    <div dir="ltr">
      <InputOTP maxLength={5} value={otp} onChange={handleOtpChange}>
        <InputOTPGroup>
          {Array.from({ length: 5 }).map((_, index) => (
            <InputOTPSlot key={index} index={index} isError={!!error} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default OtpInput;
