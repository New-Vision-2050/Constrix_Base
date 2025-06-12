import React from "react";
import { LOGIN_PHASES, LoginPhase } from "../../constant/login-phase";
import {
  ChangeEmailType,
  ValidateEmailType,
} from "../../validator/login-schema";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const ChangeEmailPhase = ({
  handleSetStep,
  handleStepBack,
}: {
  handleSetStep: (step: LoginPhase) => void;
  handleStepBack: () => void;
}) => {
  const t = useTranslations();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useFormContext<ChangeEmailType & ValidateEmailType>();

  const onSubmit = () => {
    setValue("validateEmailOtp", "");
    handleSetStep(LOGIN_PHASES.VALIDATE_EMAIL);
  };

  const handleReturn = () => {
    setValue("newEmail", "");
    handleSetStep(LOGIN_PHASES.IDENTIFIER);
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
      <h1 className="text-2xl text-center">{t("ChangeEmail.Title")}</h1>
      <Input
        label={t("ChangeEmail.NewEmail")}
        {...register("newEmail")}
        error={errors?.newEmail?.message}
      />
      <Input
        label={t("ChangeEmail.ConfirmNewEmail")}
        {...register("confirmNewEmail")}
        error={errors?.confirmNewEmail?.message}
      />
      <p className="opacity-50">{t("ChangeEmail.NoCopy")}</p>
      <div className="flex flex-col gap-2 items-center">
        <Button
          type="submit"
          form="login-form"
          onClick={handleSubmit(onSubmit)}
          className="w-full"
        >
          {t("ChangeEmail.Confirm")}
        </Button>
        <Button
          onClick={handleReturn}
          type="button"
          variant={"link"}
          className="text-primary w-fit underline"
        >
          {t("ChangeEmail.BackToLogin")}
        </Button>
      </div>
    </div>
  );
};

export default ChangeEmailPhase;
