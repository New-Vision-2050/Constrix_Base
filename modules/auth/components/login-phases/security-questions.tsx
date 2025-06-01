import React from "react";
import { LOGIN_PHASES, LoginPhase } from "../../constant/login-phase";
import { SecurityQuestionsType } from "../../validator/login-schema";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const SecurityQuestionsPhase = ({
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
  } = useFormContext<SecurityQuestionsType>();

  const onSubmit = () => {
    handleSetStep(LOGIN_PHASES.CHANGE_EMAIL);
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
    </div>
  );
};

export default SecurityQuestionsPhase;
