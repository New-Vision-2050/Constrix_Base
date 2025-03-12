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
import { LOGIN_PHASES, LoginPhase } from "../../constant/login-phase";
import AnotherCheckingWay from "../another-checking-way";
import { useLoginSteps } from "../../store/mutations";
import OtpHub from "../resend-otp/otp-hub";
import { useAuthStore } from "../../store/use-auth";
import { useRouter } from "next/navigation";
import { ROUTER } from "@/router";
import { setCookie } from "cookies-next";
import { useErrorDialogStore } from "@/store/use-error-dialog-store";

const ValidateEmailPhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
  const openDialog = useErrorDialogStore((state) => state.openDialog);

  const router = useRouter();

  const {
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    setValue,
  } = useFormContext<IdentifierType & ValidateEmailType & ChangeEmailType>();
  const { mutate, isPending } = useLoginSteps();

  const by = getValues("by");
  const loginOptionAlternatives = getValues("login_option_alternatives");

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
          if (!data.payload.login_way.step) {
            useAuthStore.getState().setUser(data.payload.user);
            setCookie("new-vision-token", data.payload.token, {
              maxAge: 7 * 24 * 60 * 60,
              path: "/",
            });
            router.push(ROUTER.COMPANIES);
            return;
          }
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
          const description = error.response?.data?.message?.description;
          openDialog(description);
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
          <span dir="ltr">{by}</span>
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
        {!!loginOptionAlternatives && loginOptionAlternatives.length > 0 && (
          <AnotherCheckingWay
            loginOptionAlternatives={loginOptionAlternatives}
            handleSetStep={handleSetStep}
          />
        )}
      </div>
    </>
  );
};

export default ValidateEmailPhase;
