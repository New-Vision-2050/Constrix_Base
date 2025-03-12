"use client";

import { useFormContext } from "react-hook-form";
import { LoginType } from "../../validator/login-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LOGIN_PHASES, LoginPhase } from "../../constant/login-phase";
import { useResetPassword } from "../../store/mutations";
import { useErrorDialogStore } from "@/store/use-error-dialog-store";

const ResetPasswordPhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
  const openDialog = useErrorDialogStore((state) => state.openDialog);

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
        onError(error) {
          const description = error.response?.data?.message?.description;
          openDialog(description);
        },
      }
    );
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
      <Button
        loading={isPending}
        onClick={handleSubmit(onSubmit)}
        className="w-full"
      >
        تأكيد
      </Button>
    </>
  );
};

export default ResetPasswordPhase;
