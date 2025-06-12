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
  handleStepBack,
}: {
  handleSetStep: (step: LoginPhase) => void;
  handleStepBack: () => void;
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
        token: data.token ?? "",
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
    <div className="relative flex flex-col gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-0 left-0"
        onClick={() => handleStepBack()}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Button>
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
    </div>
  );
};

export default ResetPasswordPhase;
