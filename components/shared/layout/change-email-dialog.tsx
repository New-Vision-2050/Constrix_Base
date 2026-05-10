"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SimpleOTPVerifyDialog } from "./simple-otp-dialog";
import CustomInputField from "@/modules/user-profile/components/tabs/user-contract/tabs/PersonalData/components/content-manager/PersonalDataSection/components/connection-user-data/edit-mode/CustomInputField";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/config/axios-config";
import { useAuthStore } from "@/modules/auth/store/use-auth";

type ChangeEmailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ChangeEmailDialog({ open, onOpenChange }: ChangeEmailDialogProps) {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [openOtp, setOpenOtp] = useState(false);

  const handleChangeEmail = async () => {
    try {
      setLoading(true);
      setError("");
      const oldEmail = user?.email;

      if (oldEmail === newEmail) {
        setError("البريد الألكتروني مسجل مسبقا");
        setLoading(false);
        return;
      }

      if (!newEmail || newEmail.trim() === "") {
        setError("يرجى إدخال البريد الإلكتروني");
        setLoading(false);
        return;
      }

      const body = {
        identifier: newEmail,
        type: "email",
      };
      
      await apiClient.post(`/company-users/send-otp`, body);
      setOpenOtp(true);
      setLoading(false);
    } catch (error: any) {
      console.log("error_error", error);
      const errorMessage = error?.response?.data?.message || "حدث خطأ أثناء إرسال رمز التحقق";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleOtpSuccess = () => {
    setOpenOtp(false);
    onOpenChange(false);
    window.location.reload();
  };

  return (
    <>
      <Dialog open={open && !openOtp} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تغيير البريد الإلكتروني</DialogTitle>
          </DialogHeader>
          <div className="mt-6 space-y-4">
            <div className="flex flex-col gap-2">
              <CustomInputField
                type="email"
                value={user?.email || ""}
                disabled={true}
                label="البريد الإلكتروني القديم"
                onChange={() => {}}
              />
            </div>
            <div className="flex flex-col gap-2">
              <CustomInputField
                type="email"
                value={newEmail}
                disabled={loading}
                label="قم بإدخال بريدك الإلكتروني الجديد"
                onChange={(str: string) => setNewEmail(str)}
                error={error}
                setError={setError}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleChangeEmail}
              disabled={loading}
            >
              التالي
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <SimpleOTPVerifyDialog
        identifier={newEmail}
        type="email"
        open={openOtp}
        setOpen={setOpenOtp}
        onSuccess={handleOtpSuccess}
      />
    </>
  );
}
