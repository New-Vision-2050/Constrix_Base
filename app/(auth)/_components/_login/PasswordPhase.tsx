"use client";

import { useFormContext } from "react-hook-form";
import {  PasswordType } from "../../_validator/login-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LOGIN_PHASES, LoginPhase } from "../../constant";

const PasswordPhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useFormContext<PasswordType>();

  const handleLogin = () => {
    const data = getValues();
    console.log("formSubmitted: ", data);
  };

  const handleForgetPhase = () => {
    handleSetStep(LOGIN_PHASES.FORGET_PASSWORD);
  };

  return (
    <>
      <h1 className="text-2xl text-center">ادخل كلمة المرور</h1>
      <Input
        type="password"
        {...register("password")}
        label="كلمة المرور"
        error={errors?.password?.message}
      />
      <Button
        size={"lg"}
        className="w-full"
        onClick={handleSubmit(handleLogin)}
      >
        دخول
      </Button>
      <Button variant={"link"} onClick={handleForgetPhase}>
        هل نسيت كلمة المرور؟{" "}
      </Button>
    </>
  );
};

export default PasswordPhase;
