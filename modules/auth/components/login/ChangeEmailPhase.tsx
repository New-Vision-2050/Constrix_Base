import React from "react";
import { LOGIN_PHASES, LoginPhase } from "../../constant/loginPhases";
import {
  ChangeEmailType,
  ValidateEmailType,
} from "../../validator/loginSchema";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ChangeEmailPhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
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
      {" "}
      <h1 className="text-2xl text-center">تغيير البريد الالكتروني</h1>
      <Input
        label="البريد الالكتروني الجديد"
        {...register("newEmail")}
        error={errors?.newEmail?.message}
      />
      <Input
        label="تأكيد البريد الالكتروني الجديد"
        {...register("confirmNewEmail")}
        error={errors?.confirmNewEmail?.message}
      />{" "}
      <p className="opacity-50">
        لا يمكن نسخ البريد الالكتروني يجب اعادة كتابتها يدويا{" "}
      </p>
      <div className="flex flex-col gap-2 items-center">
        <Button onClick={handleSubmit(onSubmit)} className="w-full">
          تأكيد
        </Button>
        <Button
          onClick={handleReturn}
          type="button"
          variant={"link"}
          className="text-primary w-fit underline"
        >
          الرجوع للدخول{" "}
        </Button>
      </div>{" "}
    </>
  );
};

export default ChangeEmailPhase;
