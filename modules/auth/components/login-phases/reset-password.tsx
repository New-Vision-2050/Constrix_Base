"use client";

import { useFormContext } from "react-hook-form";
import { LoginType } from "../../validator/login-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LOGIN_PHASES, LoginPhase } from "../../constant/login-phase";
import { useResetPassword } from "../../store/mutations";
import { useTranslations } from "next-intl";

const ResetPasswordPhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
  const t = useTranslations();
  const { mutate, isPending } = useResetPassword();
  const {
    formState: { errors },
    handleSubmit,
    register,
    getValues,
    reset,
  } = useFormContext<LoginType>();

  const onSubmit = () => {
    const data = getValues();

    mutate(
      {
        identifier: data.identifier,
        otp: data.forgetPasswordOtp,
        password: data.newPassword,
        password_confirmation: data.confirmNewPassword,
      },
      {
        onSuccess: () => {
          reset();
          handleSetStep(LOGIN_PHASES.IDENTIFIER);
        },
      }
    );
  };

  return (
    <>
      <div className="space-y-5">
        <h1 className="text-2xl text-center">{t("ResetPassword.Title")}</h1>
        <Input
          type="password"
          label={t("ResetPassword.NewPassword")}
          {...register("newPassword")}
          error={errors?.newPassword?.message}
        />
        <p className="opacity-50">{t("ResetPassword.PasswordRequirements")}</p>
        <Input
          type="password"
          label={t("ResetPassword.ConfirmNewPassword")}
          {...register("confirmNewPassword")}
          error={errors?.confirmNewPassword?.message}
        />
      </div>
      <Button
        loading={isPending}
        onClick={handleSubmit(onSubmit)}
        className="w-full"
        type="submit"
        form="login-form"
      >
        {t("ResetPassword.Confirm")}
      </Button>
    </>
  );
};

export default ResetPasswordPhase;
