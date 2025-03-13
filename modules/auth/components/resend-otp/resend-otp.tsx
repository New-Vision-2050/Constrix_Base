import { Button } from "@/components/ui/button";
import { useForgetPassword, useResendOtp } from "../../store/mutations";

const ResendOtp = ({
  timerReset,
  identifier,
  resendFor,
  token,
}: {
  timerReset: () => void;
  identifier: string;
  resendFor: "resend-otp" | "forget-password";
  token: string;
}) => {
  const { mutate: mutateOtp, isPending: isPendingOtp } = useResendOtp();
  const { mutate: mutateForget, isPending: isPendingForget } =
    useForgetPassword();

  const handleResend = () => {
    switch (resendFor) {
      case "resend-otp":
        mutateOtp(
          { identifier, token },
          {
            onSuccess: timerReset,
          }
        );
        break;
      case "forget-password":
        mutateForget(
          { identifier, token },
          {
            onSuccess: timerReset,
          }
        );
        break;
      default:
        return;
    }
  };
  return (
    <div className="flex gap-1">
      <p>لم يصلك رمز التحقق؟</p>{" "}
      <Button
        onClick={handleResend}
        loading={isPendingOtp || isPendingForget}
        variant={"link"}
        className="p-0 h-auto underline"
        type="button"
      >
        إعادة الإرسال
      </Button>
    </div>
  );
};

export default ResendOtp;
