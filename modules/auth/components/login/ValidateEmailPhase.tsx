"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  ChangeEmailType,
  IdentifierType,
  ValidateEmailType,
} from "../../validator/login-schema";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputError,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useCountDown } from "../../hooks/useCountDown";
import { useEffect } from "react";
import AutoHeight from "@/components/animation/AutoHeight";
import { ClockIcon } from "lucide-react";
import { LOGIN_PHASES, LoginPhase } from "../../constant";
import AnotherCheckingWay from "../AnotherCheckingWay";

const ValidateEmailPhase = ({
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
  } = useFormContext<IdentifierType & ValidateEmailType & ChangeEmailType>();
  const identifier = getValues("newEmail") || getValues("identifier");

  const onSubmit = (data: ValidateEmailType) => {
    console.log("formSubmitted: ", data);
    handleSetStep(LOGIN_PHASES.IDENTIFIER);
  };

  const handleSecurityQuestionsPhase = () => {
    handleSetStep(LOGIN_PHASES.SECURITY_QUESTIONS);
  };

  useEffect(() => {
    timerStart();
  }, []);

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-2xl text-start">التحقق من البريد الالكتروني</h1>
        <p>
          <span className="opacity-50">ادخل رمز التحقق المرسل على </span>
          {identifier}
        </p>
      </div>
      <Controller
        name="validateEmailOtp"
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
                    isError={!!errors?.validateEmailOtp?.message}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <InputError error={errors?.validateEmailOtp?.message} />
          </div>
        )}
      />
      <Button onClick={handleSubmit(onSubmit)} className="w-full">
        دخول
      </Button>
      <div className="h-6">
        <AutoHeight condition={time === 0}>
          <ResendEmail timerReset={timerReset} />
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
          onClick={handleSecurityQuestionsPhase}
          type="button"
          variant={"link"}
          className="text-primary p-0 h-auto underline"
        >
          تغيير البريد الالكتروني{" "}
        </Button>

        <AnotherCheckingWay />
      </div>
    </>
  );
};

const ResendEmail = ({ timerReset }: { timerReset: () => void }) => {
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

export default ValidateEmailPhase;
