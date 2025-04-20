import { OTPVerifyDialog } from "./OTPVerify";
import { useConnectionOTPCxt } from "../context/ConnectionOTPCxt";
import CustomInputField from "./CustomInputField";
import { useState } from "react";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/config/axios-config";

export default function UserProfileConnectionDataEditForm() {
  const {
    openMailOtp,
    openPhoneOtp,
    toggleMailOtpDialog,
    togglePhoneOtpDialog,
  } = useConnectionOTPCxt();
  const { userConnectionData } = usePersonalDataTabCxt();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState(userConnectionData?.phone ?? "");
  const [email, setEmail] = useState(userConnectionData?.email ?? "");

  const handleChange = async (type: "phone" | "email") => {
    try {
      setLoading(true);
      const newValue = type === "email" ? email : phone;
      const oldValue =
        type === "email"
          ? userConnectionData?.email
          : userConnectionData?.phone;

      if (oldValue === newValue) {
        setLoading(false);
        return;
      }
      const body = {
        identifier: newValue,
        type: type, //phone - email
      };
      await apiClient.post(`/company-users/send-otp`, body);


      if (type === "email") toggleMailOtpDialog();
      else togglePhoneOtpDialog();
      setLoading(false);
    } catch (error) {
      console.log("error_error", error);
      setLoading(false);
    }
  };

  return (
    <>
      <OTPVerifyDialog
        identifier={email}
        open={openMailOtp}
        setOpen={toggleMailOtpDialog}
      />
      <OTPVerifyDialog
        identifier={phone}
        open={openPhoneOtp}
        setOpen={togglePhoneOtpDialog}
      />
      <div className="flex items-center justify-around gap-2">
        <div className="flex items-center gap-1">
          <CustomInputField
            value={phone}
            disabled={loading}
            label="رقم الجوال"
            onChange={(str: string) => setPhone(str)}
          />
          <Button onClick={() => handleChange("phone")}>Change</Button>
        </div>
        <div className="flex items-center gap-1">
          <CustomInputField
            value={email}
            disabled={loading}
            label="البريد الألكتروني"
            onChange={(str: string) => setEmail(str)}
          />
          <Button onClick={() => handleChange("email")}>Change</Button>
        </div>
      </div>
    </>
  );
}
