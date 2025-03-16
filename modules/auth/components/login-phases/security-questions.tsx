import React from "react";
import { LOGIN_PHASES, LoginPhase } from "../../constant/login-phase";
import { SecurityQuestionsType } from "../../validator/login-schema";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const SecurityQuestionsPhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
  const t = useTranslations();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useFormContext<SecurityQuestionsType>();

  const onSubmit = () => {
    handleSetStep(LOGIN_PHASES.CHANGE_EMAIL);
  };

  return (
    <>
      <h1 className="text-2xl text-center">{t("SecurityQuestions.Title")}</h1>
      <Input
        {...register("animal")}
        label={t("SecurityQuestions.PetQuestion")}
        error={errors?.animal?.message}
      />
      <Input
        {...register("team")}
        label={t("SecurityQuestions.TeamQuestion")}
        error={errors?.team?.message}
      />
      <Button
        size={"lg"}
        className="w-full"
        type="submit"
        form="login-form"
        onClick={handleSubmit(onSubmit)}
      >
        {t("SecurityQuestions.Next")}
      </Button>
    </>
  );
};

export default SecurityQuestionsPhase;
