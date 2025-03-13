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
}: {
  handleSetStep: (step: LoginPhase) => void;
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
    <>
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
      <p className="opacity-50">
        {t("ChangeEmail.NoCopy")}
      </p>
      <div className="flex flex-col gap-2 items-center">
        <Button onClick={handleSubmit(onSubmit)} className="w-full">
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
    </>
  );
};

export default ChangeEmailPhase;
