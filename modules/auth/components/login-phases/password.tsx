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
import { useTranslations } from "next-intl";

const PasswordPhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
  const t = useTranslations();
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
    setValue
  } = useFormContext<LoginType>();

  const loginOptionAlternatives = getValues("login_option_alternatives");

  // Listen for auth errors from the interceptor
  useEffect(() => {
    const handleAuthError = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setErrorMessage(customEvent.detail.messageKey);
        handleOpen();
      }
    };

    errorEvent.addEventListener('auth-error', handleAuthError);

    return () => {
      errorEvent.removeEventListener('auth-error', handleAuthError);
    };
  }, [handleOpen, t]);

  const handleLogin = () => {
    const data = getValues();
    mutate(
      {
        identifier: data.identifier,
        password: data.password,
        token: data.token ?? "",
      },
      {
        onSuccess: (data, variable) => {
          setValue("token", data.payload.token);
          const nextStep = data.payload.login_way.step?.login_option;
          if (!data.payload.login_way.step) {
            useAuthStore.getState().setUser(data.payload.user);
            setCookie("new-vision-token", data.payload.token, {
              maxAge: 7 * 24 * 60 * 60,
              path: "/",
            });
            router.push(ROUTER.COMPANIES);
            return;
          }
          switch (nextStep) {
            case "otp":
              if (variable.identifier.includes("@")) {
                handleSetStep(LOGIN_PHASES.VALIDATE_EMAIL);
              } else {
                handleSetStep(LOGIN_PHASES.VALIDATE_PHONE);
              }
              break;
            default:
              return;
          }
        },
        onError(error) {
          const messageKey = getErrorMessage(error);
          setErrorMessage((messageKey) || t("Errors.Authentication.InvalidCredentials"));
          handleOpen();
        },
      }
    );
  };

  const handleForgetPhase = () => {
    const data = getValues();

    forgetPasswordMutation(
      { identifier: data.identifier , token: data.token ?? "" },
      {
        onSuccess: () => {
          handleSetStep(LOGIN_PHASES.FORGET_PASSWORD);
        },
      }
    );
  };

  return (
    <>
      <h1 className="text-xl sm:text-2xl text-center mb-4">{t("Login.EnterPassword")}</h1>
      <div className="space-y-4">
        <Input
          type="password"
          {...register("password")}
          label={t("Login.Password")}
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
          {t("Login.Login")}
        </Button>

        <div className="flex justify-center">
          <Button
            loading={isPendingForgetPassword}
            variant={"link"}
            onClick={handleForgetPhase}
            className="text-sm sm:text-base"
          >
            {t("Login.ForgotPassword")}
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
