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
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useEffect } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

type PropsT = {
  open: boolean;
  identifier: string;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export function OTPVerifyDialog({ open, identifier, setOpen }: PropsT) {
  const { user } = useUserProfileCxt();
  const [timer, setTimer] = useState(0);
  const { openMailOtp, toggleMailOtpDialog, togglePhoneOtpDialog } =
    useConnectionOTPCxt();
  const t = useTranslations("UserProfile.tabs.ConnectionDataSection");
  const [error, setError] = useState("");
  const { handleRefreshConnectionData } = usePersonalDataTabCxt();
  const type = openMailOtp ? "email" : "phone";
  const [loading, setLoading] = useState(false);
  const handleClose =
    type === "email" ? toggleMailOtpDialog : togglePhoneOtpDialog;
  const [otp, setOtp] = useState("");
  const label = type === "email" ? t("email") : t("phoneNumber");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (interval) clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  useEffect(() => {
    if (open) {
      setTimer(60);
    }
  }, [open]);

  const handleResend = async () => {
    try {
      setLoading(true);
      const body = {
        identifier: identifier,
        type: type,
      };
      await apiClient.post(`/company-users/send-otp`, body);
      setTimer(60); // Restart the timer when the resend action is executed
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  const handleConfirmOtp = async () => {
    try {
      setError("");
      setLoading(true);
      const body = {
        identifier: identifier,
        otp: otp,
        type,
      };
      await apiClient.post(
        `/company-users/validate-otp/${user?.user_id}`,
        body
      );
      handleClose();
      toast.success(t("changeSuccess"));
      setLoading(false);
      handleRefreshConnectionData();
    } catch (error) {
      setLoading(false);
      console.log("error", error);
      setError(t("invalidOtp"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] flex flex-col gap-5">
        <DialogHeader className="flex items-center justify-center relative">
          <DialogTitle>
            <InfoIcon additionClass="text-pink-500 text-[22px]" />
          </DialogTitle>
          <DialogDescription>
            {t("enterOtpSentTo", {label})}
          </DialogDescription>
        </DialogHeader>

        <div className="absolute top-2 right-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            <X />
          </Button>
        </div>

        <div className="w-full flex items-center justify-center gap-1">
          <OtpInput otp={otp} setOtp={setOtp} />
        </div>
        <small className="text-red-500">{error}</small>

        <div className="flex items-center justify-center gap-4">
          <Button disabled={loading} onClick={handleConfirmOtp}>
            {t("confirm")}
          </Button>
          <Button
            disabled={loading || timer > 0}
            variant={"ghost"}
            onClick={handleResend}
          >
            {t("resend")} {timer > 0 && `(${timer})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
