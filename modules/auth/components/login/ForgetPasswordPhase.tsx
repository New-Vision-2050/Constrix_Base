"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  ForgetPasswordType,
  IdentifierType,
} from "../../validator/loginSchema";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputError,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { LOGIN_PHASES, LoginPhase } from "../../constant/loginPhases";
import OtpHub from "../resend-otp/OtpHub";

const ForgetPasswordPhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
  const {
    formState: { errors },
    handleSubmit,
    control,
    getValues,
  } = useFormContext<IdentifierType & ForgetPasswordType>();
  const identifier = getValues("identifier");

  const onSubmit = () => {
    handleSetStep(LOGIN_PHASES.RESET_PASSWORD);
  };

  return (
    <>
      <h1 className="text-2xl text-center">نسيت كلمة المرور</h1>
      <p>
        <span className="opacity-50 block">
          ادخل كلمة المرور المؤقتة المرسلة على البريد الالكتروني
        </span>
        {identifier}
      </p>
      <Controller
        name="forgetPasswordOtp"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col px-4">
            <div dir="ltr">
              <InputOTP
                maxLength={5}
                value={field.value}
                onChange={field.onChange}
              >
                <InputOTPGroup>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      isError={!!errors?.forgetPasswordOtp?.message}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <InputError error={errors?.forgetPasswordOtp?.message} />
          </div>
        )}
      />
      <Button onClick={handleSubmit(onSubmit)} className="w-full">
        تأكيد
      </Button>{" "}
      <OtpHub identifier={identifier} resendFor={'forget-password'}/>
    </>
  );
};

export default ForgetPasswordPhase;
