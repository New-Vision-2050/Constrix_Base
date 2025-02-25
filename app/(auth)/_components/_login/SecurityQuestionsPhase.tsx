import React from "react";
import { LOGIN_PHASES, LoginPhase } from "../../constant";
import { SecurityQuestionsType } from "../../_validator/login-schema";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SecurityQuestionsPhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
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
      {" "}
      <h1 className="text-2xl text-center">اسئلة الامان</h1>{" "}
      <Input
        {...register("animal")}
        label="ما هو اسم حيوانك الأليف المفضل؟"
        error={errors?.animal?.message}
      />{" "}
      <Input
        {...register("team")}
        label="ما اسم فريقك الرياضي المفضل؟"
        error={errors?.team?.message}
      />
      <Button size={"lg"} className="w-full" onClick={handleSubmit(onSubmit)}>
        التالي
      </Button>
    </>
  );
};

export default SecurityQuestionsPhase;
