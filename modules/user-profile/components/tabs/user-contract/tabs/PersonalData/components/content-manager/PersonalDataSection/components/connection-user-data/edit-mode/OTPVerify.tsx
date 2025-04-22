import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import InfoIcon from "@/public/icons/InfoIcon";
import OtpInput from "./OtpInput";
import { useConnectionOTPCxt } from "../context/ConnectionOTPCxt";
import { apiClient } from "@/config/axios-config";
import { toast } from "sonner";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";

type PropsT = {
  open: boolean;
  identifier: string;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export function OTPVerifyDialog({ open, identifier, setOpen }: PropsT) {
  const { openMailOtp, toggleMailOtpDialog, togglePhoneOtpDialog } =
    useConnectionOTPCxt();
  const { handleRefreshConnectionData } = usePersonalDataTabCxt();
  const type = openMailOtp ? "email" : "phone";
  const [loading, setLoading] = useState(false);
  const handleClose =
    type === "email" ? toggleMailOtpDialog : togglePhoneOtpDialog;
  const [otp, setOtp] = useState("");
  const label = type === "email" ? "البريد الالكتروني" : "رقم الجوال";

  const handleResend = async () => {
    try {
      setLoading(true);
      const body = {
        identifier: identifier,
        type: type,
      };
      await apiClient.post(`/company-users/send-otp`, body);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  const handleConfirmOtp = async () => {
    try {
      setLoading(true);
      const body = {
        identifier: identifier,
        otp: otp,
        type,
      };
      await apiClient.post(`/company-users/validate-otp`, body);
      handleClose();
      toast.success("تم التغير بنجاح");
      setLoading(false);
      handleRefreshConnectionData();
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] flex flex-col gap-5">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle>
            <InfoIcon additionClass="text-pink-500 text-[22px]" />
          </DialogTitle>
          <DialogDescription>
            يرجى ادخال رمز التحقق المرسل الى {label}
          </DialogDescription>
        </DialogHeader>

        <div className="w-full flex items-center justify-center gap-1">
          <OtpInput otp={otp} setOtp={setOtp} />
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button disabled={loading} onClick={handleConfirmOtp}>
            تأكيد
          </Button>
          <Button disabled={loading} variant={"ghost"} onClick={handleResend}>
            اعادة الارسال
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
