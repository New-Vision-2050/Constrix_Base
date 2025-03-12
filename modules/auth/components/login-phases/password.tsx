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
import { useEffect, useState } from "react";
import { errorEvent, getErrorMessage } from "@/utils/errorHandler";
import { useModal } from "@/hooks/use-modal";
import ErrorDialog from "@/components/shared/error-dialog";

const PasswordPhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, handleOpen, handleClose] = useModal();

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
  
  // Listen for auth errors from the interceptor
  useEffect(() => {
    const handleAuthError = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setErrorMessage(customEvent.detail.message);
        handleOpen();
      }
    };

    errorEvent.addEventListener('auth-error', handleAuthError);
    
    return () => {
      errorEvent.removeEventListener('auth-error', handleAuthError);
    };
  }, [handleOpen]);

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
          const message = getErrorMessage(error);
          setErrorMessage(message || "كلمة المرور غير صحيحة");
          handleOpen();
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
      <h1 className="text-xl sm:text-2xl text-center mb-4">ادخل كلمة المرور</h1>
      <div className="space-y-4">
        <Input
          type="password"
          {...register("password")}
          label="كلمة المرور"
          error={errors?.password?.message}
        />

        <Button
          size={"lg"}
          className="w-full mt-4"
          loading={isPending}
          onClick={handleSubmit(handleLogin)}
          type="submit"
          form="login-form"
        >
          دخول
        </Button>

        <div className="flex justify-center">
          <Button
            loading={isPendingForgetPassword}
            variant={"link"}
            onClick={handleForgetPhase}
            className="text-sm sm:text-base"
          >
            هل نسيت كلمة المرور؟
          </Button>
        </div>

        {!!loginOptionAlternatives && loginOptionAlternatives.length > 0 && (
          <div className="mt-2">
            <AnotherCheckingWay
              loginOptionAlternatives={loginOptionAlternatives}
              handleSetStep={handleSetStep}
            />
          </div>
        )}
      </div>
      <ErrorDialog
        isOpen={isOpen}
        handleClose={handleClose}
        desc={errorMessage}
      />
    </>
  );
};

export default PasswordPhase;
