import React, { useEffect } from "react";
import { useCountDown } from "../../hook/useCountDown";
import { Controller, useFormContext } from "react-hook-form";
import { IdentifierType, ValidatePhoneType } from "../../validator/loginSchema";
import AutoHeight from "@/components/animation/AutoHeight";
import ClockIcon from "@/public/icons/ClockIcon";
import { Button } from "@/components/ui/button";
import AnotherCheckingWay from "../AnotherCheckingWay";
import {
  InputError,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LOGIN_PHASES, LoginPhase } from "../../constant/loginPhases";

const ValidatePhonePhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
  const {
    counter: time,
    start: timerStart,
    reset: timerReset,
  } = useCountDown(30);
  const {
    formState: { errors },
    handleSubmit,
    control,
    getValues,
  } = useFormContext<IdentifierType & ValidatePhoneType>();
  const identifier = getValues("identifier");

  const onSubmit = (data: ValidatePhoneType) => {
    console.log("formSubmitted: ", data);
    handleSetStep(LOGIN_PHASES.IDENTIFIER);
  };

  useEffect(() => {
    timerStart();
  }, []);

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-2xl text-start">التحقق من رقم الجوال</h1>
        <p>
          <span className="opacity-50">ادخل رمز التحقق المرسل الى </span>
          {identifier}
        </p>
      </div>
      <Controller
        name="validatePhoneOtp"
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
                    isError={!!errors?.validatePhoneOtp?.message}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <InputError error={errors?.validatePhoneOtp?.message} />
          </div>
        )}
      />
      <Button onClick={handleSubmit(onSubmit)} className="w-full">
        دخول
      </Button>
      <div className="h-6">
        <AutoHeight condition={time === 0}>
          <ResendSMS timerReset={timerReset} />
        </AutoHeight>
        <AutoHeight condition={time > 0}>
          <div className="flex items-center gap-2 w-full justify-center">
            <ClockIcon />
            <p>0:{time}</p>
          </div>
        </AutoHeight>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={"link"}
          className="text-primary p-0 h-auto underline"
        >
          تغيير رقم الجوال{" "}
        </Button>

        <AnotherCheckingWay />
      </div>
    </>
  );
};

const ResendSMS = ({ timerReset }: { timerReset: () => void }) => {
  return (
    <div className="flex gap-1">
      <p>لم يصلك رمز التحقق؟</p>{" "}
      <Button
        onClick={timerReset}
        variant={"link"}
        className="p-0 h-auto underline"
        type="button"
      >
        إعادة الإرسال
      </Button>
    </div>
  );
};
export default ValidatePhonePhase;
