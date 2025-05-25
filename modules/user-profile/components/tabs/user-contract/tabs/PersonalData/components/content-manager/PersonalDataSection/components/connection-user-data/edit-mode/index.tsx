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
  const [code, setCode] = useState("+966");
  const [error, setError] = useState("");
  const [phone, setPhone] = useState(userConnectionData?.phone ?? "");
  const [email, setEmail] = useState(userConnectionData?.email ?? "");

  const handleChange = async (type: "phone" | "email") => {
    try {
      setLoading(true);
      const newValue = type === "email" ? email : `${code}${phone}`;
      const oldValue =
        type === "email"
          ? userConnectionData?.email
          : userConnectionData?.phone;

      if (oldValue === newValue || (type === "phone" && newValue == phone)) {
        const _message =
          type === "email"
            ? "البريد الألكتروني هو نفس البريد المسجل مسبقا"
            : "رقم الجوال هو نفس رقم الجوال المسجل مسبقا";
        setError(_message);
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
        identifier={`${code}${phone}`}
        open={openPhoneOtp}
        setOpen={togglePhoneOtpDialog}
      />
      <div className="flex items-center justify-around gap-2">
        <div className="flex items-end gap-1">
          <CustomInputField
            type="phone"
            value={phone}
            disabled={loading}
            setPhoneCode={setCode}
            label="رقم الجوال"
            onChange={(str: string) => setPhone(str)}
          />
          <Button className="my-[2px]" onClick={() => handleChange("phone")}>
            Change
          </Button>
        </div>
        <div className="flex items-end gap-1">
          <CustomInputField
            type="email"
            value={email}
            disabled={loading}
            label="البريد الألكتروني"
            onChange={(str: string) => setEmail(str)}
            error={error}
            setError={setError}
          />
          <Button className="my-[2px]" onClick={() => handleChange("email")}>
            Change
          </Button>
        </div>
      </div>
    </>
  );
}
