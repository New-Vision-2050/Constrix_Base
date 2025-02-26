"use client";

import { useFormContext } from "react-hook-form";
import { LoginType } from "../../validator/loginSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LOGIN_PHASES, LoginPhase } from "../../constant/loginPhases";
import { useLoginSteps } from "../../store/mutations";

const PasswordPhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
  const { mutate, isPending } = useLoginSteps();
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useFormContext<LoginType>();

  const handleLogin = () => {
    const data = getValues();
    mutate(
      {
        identifier: data.identifier,
        password: data.password,
        token: data.token ?? "",
      },
      {
        onSuccess: (data) => {
          console.log(data.payload);
        },
        onError(error) {
          console.log(error);
        },
      }
    );
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
        loading={isPending}
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
