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
import { LOGIN_PHASES, LoginPhase } from "../../constant/login-phase";
import OtpHub from "../resend-otp/otp-hub";
import { useValidateResetPasswordOtp } from "../../store/mutations";
import { useTranslations } from "next-intl";

const ForgetPasswordPhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
  const t = useTranslations();
  const {
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    setValue,
  } = useFormContext<IdentifierType & ForgetPasswordType>();
  const { mutate, isPending } = useValidateResetPasswordOtp();
  const identifier = getValues("identifier");
  const token = getValues("token");

  const onSubmit = () => {
    const otp = getValues("forgetPasswordOtp");

    mutate(
      { identifier, otp },
      {
        onSuccess: (res) => {
          setValue("token", res.payload.token);
          handleSetStep(LOGIN_PHASES.RESET_PASSWORD);
        },
      }
    );
  };

  return (
    <>
      <h1 className="text-2xl text-center">{t("ForgotPassword.Title")}</h1>
      <p>
        <span className="opacity-50 block">
          {t("ForgotPassword.EnterTemporaryPassword")}
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
      <Button
        onClick={handleSubmit(onSubmit)}
        loading={isPending}
        type="submit"
        form="login-form"
        className="w-full"
      >
        {t("ForgotPassword.Confirm")}
      </Button>{" "}
      <OtpHub
        identifier={identifier}
        resendFor={"forget-password"}
        token={token ?? ""}
      />
    </>
  );
};

export default ForgetPasswordPhase;
