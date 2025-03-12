"use client";

import { useFormContext } from "react-hook-form";
import { LoginType } from "../../validator/login-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LOGIN_PHASES, LoginPhase } from "../../constant/login-phase";
import { useForgetPassword, useLoginSteps } from "../../store/mutations";
import { useAuthStore } from "../../store/use-auth";
import { useRouter } from "next/navigation";
import { ROUTER } from "@/router";
import { setCookie } from "cookies-next";
import AnotherCheckingWay from "../another-checking-way";
import { useErrorDialogStore } from "@/store/use-error-dialog-store";

const PasswordPhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
  const openDialog = useErrorDialogStore((state) => state.openDialog);

  const router = useRouter();

  const { mutate: forgetPasswordMutation, isPending: isPendingForgetPassword } =
    useForgetPassword();
  const { mutate, isPending } = useLoginSteps();
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useFormContext<LoginType>();

  const loginOptionAlternatives = getValues("login_option_alternatives");

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
          if (!data.payload.login_way.step) {
            useAuthStore.getState().setUser(data.payload.user);
            setCookie("new-vision-token", data.payload.token, {
              maxAge: 7 * 24 * 60 * 60,
              path: "/",
            });
            router.push(ROUTER.COMPANIES);
            return;
          }
        },
        onError(error) {
          const description = error.response?.data?.message?.description;
          openDialog(description);
        },
      }
    );
  };

  const handleForgetPhase = () => {
    const data = getValues();

    forgetPasswordMutation(
      { identifier: data.identifier },
      {
        onSuccess: () => {
          handleSetStep(LOGIN_PHASES.FORGET_PASSWORD);
        },
      }
    );
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
      <Button
        loading={isPendingForgetPassword}
        variant={"link"}
        onClick={handleForgetPhase}
      >
        هل نسيت كلمة المرور؟
      </Button>
      {!!loginOptionAlternatives && loginOptionAlternatives.length > 0 && (
        <AnotherCheckingWay
          loginOptionAlternatives={loginOptionAlternatives}
          handleSetStep={handleSetStep}
        />
      )}
    </>
  );
};

export default PasswordPhase;
