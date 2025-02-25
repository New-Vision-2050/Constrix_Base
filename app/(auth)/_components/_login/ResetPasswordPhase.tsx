"use client";

import { useFormContext } from "react-hook-form";
import { ResetPasswordType } from "../../_validator/login-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LOGIN_PHASES, LoginPhase } from "../../constant";

const ResetPasswordPhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useFormContext<ResetPasswordType>();

  const onSubmit = (data: ResetPasswordType) => {
    console.log(data);
    handleSetStep(LOGIN_PHASES.IDENTIFIER);
  };

  return (
    <>
      <div className="space-y-5">
        <h1 className="text-2xl text-center">اعادة تعيين كلمة المرور</h1>
        <Input
          type="password"
          label="كلمة المرور الجديدة"
          {...register("newPassword")}
          error={errors?.newPassword?.message}
        />
        <p className="opacity-50">
          يجب أن تكون كلمة المرور بطول 8 أحرف على الأقل، حرف كبير واحد على
          الأقل، استخدام رمز خاص واحد على الأقل.
        </p>
        <Input
          type="password"
          label="تأكيد كلمة المرور الجديدة"
          {...register("confirmNewPassword")}
          error={errors?.confirmNewPassword?.message}
        />
      </div>
      <Button onClick={handleSubmit(onSubmit)} className="w-full">
        تأكيد
      </Button>
    </>
  );
};

export default ResetPasswordPhase;
