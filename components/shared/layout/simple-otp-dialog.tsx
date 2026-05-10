"use client";

import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { SetStateAction, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import InfoIcon from "@/public/icons/InfoIcon";
import OtpInput from "@/modules/user-profile/components/tabs/user-contract/tabs/PersonalData/components/content-manager/PersonalDataSection/components/connection-user-data/edit-mode/OtpInput";
import { apiClient } from "@/config/axios-config";
import { toast } from "sonner";
import { X } from "lucide-react";

type PropsT = {
  open: boolean;
  identifier: string;
  type: "email" | "phone";
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  onSuccess?: () => void;
};

export function SimpleOTPVerifyDialog({ open, identifier, type, setOpen, onSuccess }: PropsT) {
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const label = type === "email" ? "البريد الالكتروني" : "رقم الجوال";

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
      setOtp("");
      setError("");
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
      setTimer(60);
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
      
      // Validate OTP first
      await apiClient.post(`/company-users/validate-otp`, body);

      // Update the email/phone after successful OTP validation
      const updateBody = type === "email"
        ? { email: identifier }
        : { phone: identifier };

      await apiClient.put(`/company-users/data-info`, updateBody);

      setOpen(false);
      toast.success("تم التغير بنجاح");
      setLoading(false);
      
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.reload();
      }
    } catch (error) {
      setLoading(false);
      console.log("error", error);
      setError(`كلمه المرور الموقته غير صحيحية`);
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
            يرجى ادخال رمز التحقق المرسل الى {label}
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
            تأكيد
          </Button>
          <Button
            disabled={loading || timer > 0}
            variant={"ghost"}
            onClick={handleResend}
          >
            اعادة الارسال {timer > 0 && `(${timer})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
