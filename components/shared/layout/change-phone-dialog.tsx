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

type ChangePhoneDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ChangePhoneDialog({ open, onOpenChange }: ChangePhoneDialogProps) {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("+966");
  const [openOtp, setOpenOtp] = useState(false);

  const handleChangePhone = async () => {
    try {
      setLoading(true);
      setError("");
      const oldPhone = user?.phone;
      const fullNewPhone = `${phoneCode}${newPhone}`;

      if (oldPhone === fullNewPhone) {
        setError("رقم الجوال مسجل مسبقا");
        setLoading(false);
        return;
      }

      if (!newPhone || newPhone.trim() === "") {
        setError("يرجى إدخال رقم الجوال");
        setLoading(false);
        return;
      }

      const body = {
        identifier: fullNewPhone,
        type: "phone",
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
            <DialogTitle>تغيير رقم الجوال</DialogTitle>
          </DialogHeader>
          <div className="mt-6 space-y-4">
            <div className="flex flex-col gap-2">
              <CustomInputField
                type="phone"
                value={user?.phone || ""}
                disabled={true}
                label="رقم الجوال القديم"
                onChange={() => {}}
              />
            </div>
            <div className="flex flex-col gap-2">
              <CustomInputField
                type="phone"
                value={newPhone}
                disabled={loading}
                setPhoneCode={setPhoneCode}
                label="قم بإدخال رقم الجوال الجديد"
                onChange={(str: string) => setNewPhone(str)}
                error={error}
                setError={setError}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleChangePhone}
              disabled={loading}
            >
              التالي
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <SimpleOTPVerifyDialog
        identifier={`${phoneCode}${newPhone}`}
        type="phone"
        open={openOtp}
        setOpen={setOpenOtp}
        onSuccess={handleOtpSuccess}
      />
    </>
  );
}
