"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  ChangeEmailType,
  IdentifierType,
  ValidateEmailType,
} from "../../validator/loginSchema";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputError,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { LOGIN_PHASES, LoginPhase } from "../../constant/loginPhases";
import AnotherCheckingWay from "../AnotherCheckingWay";
import { useLoginSteps } from "../../store/mutations";
import OtpHub from "../resend-otp/OtpHub";

const ValidateEmailPhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
  const {
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    setValue,
  } = useFormContext<IdentifierType & ValidateEmailType & ChangeEmailType>();
  const { mutate, isPending } = useLoginSteps();

  const identifier = getValues("newEmail") || getValues("identifier");

  const onSubmit = () => {
    const data = getValues();

    mutate(
      {
        identifier: data.identifier,
        password: data.validateEmailOtp,
        token: data.token ?? "",
      },
      {
        onSuccess: (data, variable) => {
          setValue("token", data.payload.token);
          const nextStep = data.payload.login_way.step?.login_option;
          switch (nextStep) {
            case "password":
              handleSetStep(LOGIN_PHASES.PASSWORD);
              break;
            case "otp":
              if (variable.identifier.includes("@")) {
                handleSetStep(LOGIN_PHASES.VALIDATE_EMAIL);
              } else {
                handleSetStep(LOGIN_PHASES.VALIDATE_PHONE);
              }
              break;
            default:
              return;
          }
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

  const handleSecurityQuestionsPhase = () => {
    handleSetStep(LOGIN_PHASES.SECURITY_QUESTIONS);
  };

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
                      isError={!!errors?.validateEmailOtp?.message}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <InputError error={errors?.validateEmailOtp?.message} />
          </div>
        )}
      />
      <Button
        loading={isPending}
        onClick={handleSubmit(onSubmit)}
        className="w-full"
      >
        التالي
      </Button>
      <OtpHub identifier={getValues("identifier")} resendFor="resend-otp" />
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

export default ValidateEmailPhase;
