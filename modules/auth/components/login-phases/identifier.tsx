"use client";
import { useFormContext } from "react-hook-form";
import { IdentifierType } from "../../validator/login-schema";
import { Stack, TextField, Typography } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { LOGIN_PHASES, LoginPhase } from "../../constant/login-phase";
import { useLoginWays } from "../../store/mutations";
import { useEffect, useState } from "react";
import { errorEvent, getErrorMessage } from "@/utils/errorHandler";
import { useModal } from "@/hooks/use-modal";
import ErrorDialog from "@/components/shared/error-dialog";
import { useTranslations } from "next-intl";

const IdentifierPhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
  const t = useTranslations();
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, handleOpen, handleClose] = useModal();
  const { mutate, isPending } = useLoginWays();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useFormContext<IdentifierType>();

  // Listen for auth errors from the interceptor
  useEffect(() => {
    const handleAuthError = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setErrorMessage(customEvent.detail.messageKey);
        handleOpen();
      }
    };

    errorEvent.addEventListener("auth-error", handleAuthError);

    return () => {
      errorEvent.removeEventListener("auth-error", handleAuthError);
    };
  }, [handleOpen, t]);

  const onSubmit = (data: IdentifierType) => {
    mutate(
      { identifier: data.identifier },
      {
        onSuccess(data) {
          setValue("token", data.payload.token);
          setValue("first_login", data.payload.first_login?.toString());
          setValue(
            "login_option_alternatives",
            data.payload.login_way.step.login_option_alternatives,
          );
          setValue("by", data.payload.login_way.by);
          setValue("type", data.payload.login_way.type);

          const nextStep = data.payload.login_way.step?.login_option;
          if (!!data.payload.can_set_pass) {
            handleSetStep(LOGIN_PHASES.FORGET_PASSWORD);
            return;
          }
          switch (nextStep) {
            case "password":
              handleSetStep(LOGIN_PHASES.PASSWORD);
              break;
            case "otp":
              if (data.payload.login_way.type === "mail") {
                handleSetStep(LOGIN_PHASES.VALIDATE_EMAIL);
              } else if (data.payload.login_way.type === "sms") {
                handleSetStep(LOGIN_PHASES.VALIDATE_PHONE);
              }
              break;
            default:
              return;
          }
        },
        onError(error) {
          const messageKey = getErrorMessage(error);
          setErrorMessage(
            messageKey || t("Errors.Authentication.UserNotFound"),
          );
          handleOpen();
        },
      },
    );
  };

  return (
    <>
      <Typography variant="h5" textAlign="center" mb={2}>
        {t("Login.SignIn")}
      </Typography>
      <Stack spacing={2}>
        <TextField
          {...register("identifier")}
          label={t("Login.Identifier")}
          error={!!errors?.identifier?.message}
          helperText={errors?.identifier?.message}
          fullWidth
        />

        <Button
          type="submit"
          form="login-form"
          variant="default"
          size="lg"
          disabled={isPending}
          onClick={handleSubmit(onSubmit)}
          className="h-11 w-full rounded-lg border-0 bg-primary px-4 text-base font-bold text-primary-foreground shadow-none hover:bg-primary/90 focus-visible:ring-primary disabled:opacity-70 [&_svg]:size-[18px]"
        >
          {isPending ? (
            <>
              {t("Login.Loading")}
              <Loader2 className="animate-spin" aria-hidden />
            </>
          ) : (
            t("Login.Next")
          )}
        </Button>
      </Stack>

      <ErrorDialog
        isOpen={isOpen}
        handleClose={handleClose}
        desc={errorMessage}
      />
    </>
  );
};

export default IdentifierPhase;
