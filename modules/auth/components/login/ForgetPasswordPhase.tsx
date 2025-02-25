"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  ForgetPasswordType,
  IdentifierType,
} from "../../validator/login-schema";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputError,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { LOGIN_PHASES, LoginPhase } from "../../constant";

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

  const handleResend = () => {
    console.log("resend...");
  };

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
            <InputError error={errors?.forgetPasswordOtp?.message} />
          </div>
        )}
      />
      <p>
        <span className="opacity-50">تنتهي صلاحية كلمة المرور بعد </span>
        15 دقيقة
      </p>
      <div className="flex flex-col gap-2 items-center">
        <Button onClick={handleSubmit(onSubmit)} className="w-full">
          تأكيد
        </Button>
        <Button
          type="button"
          onClick={handleResend}
          variant={"link"}
          className="text-primary w-fit underline"
        >
          اعادة ارسال
        </Button>
      </div>{" "}
    </>
  );
};

export default ForgetPasswordPhase;
