"use client";

import { useFormContext } from "react-hook-form";
import { LoginType } from "../../validator/login-schema";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LOGIN_PHASES, LoginPhase } from "../../constant/login-phase";
import { useForgetPassword, useLoginSteps } from "../../store/mutations";
import { useAuthStore } from "../../store/use-auth";
import { useRouter } from "@i18n/navigation";
import { ROUTER } from "@/router";
import { setCookie } from "cookies-next";
import AnotherCheckingWay from "../another-checking-way";
import { useEffect, useState } from "react";
import { errorEvent, getErrorMessage } from "@/utils/errorHandler";
import { useModal } from "@/hooks/use-modal";
import ErrorDialog from "@/components/shared/error-dialog";
import { useTranslations } from "next-intl";
import { UsersRole } from "@/constants/users-role.enum";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const PasswordPhase = ({
  handleSetStep,
  handleStepBack,
}: {
  handleStepBack: () => void;
  handleSetStep: (step: LoginPhase) => void;
}) => {
  const t = useTranslations();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, handleOpen, handleClose] = useModal();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: forgetPasswordMutation, isPending: isPendingForgetPassword } =
    useForgetPassword();
  const { mutate, isPending , isSuccess} = useLoginSteps();
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
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

    errorEvent.addEventListener("auth-error", handleAuthError);

    return () => {
      errorEvent.removeEventListener("auth-error", handleAuthError);
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
            const userTypes = data.payload.user.user_types ?? [];
            useAuthStore.getState().setUser(data.payload.user);
            setCookie("new-vision-token", data.payload.token, {
              maxAge: 7 * 24 * 60 * 60,
              path: "/",
            });

            // handle redirect based on user type
            router.push(ROUTER.USER_PROFILE);
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
          setErrorMessage(
            messageKey || t("Errors.Authentication.InvalidCredentials"),
          );
          handleOpen();
        },
      },
    );
  };

  const handleForgetPhase = () => {
    const data = getValues();

    forgetPasswordMutation(
      { identifier: data.identifier, token: data.token ?? "" },
      {
        onSuccess: () => {
          handleSetStep(LOGIN_PHASES.FORGET_PASSWORD);
        },
      },
    );
  };

  return (
    <>
      <Box position="relative">
        <IconButton
          sx={{ position: "absolute", top: 0, left: 0 }}
          onClick={() => handleStepBack()}
          type="button"
          aria-label="go-back"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" textAlign="center" mb={2}>
          {t("Login.EnterPassword")}
        </Typography>
        <Stack spacing={2} my={1}>
          <TextField
            type={showPassword ? "text" : "password"}
            {...register("password")}
            label={t("Login.Password")}
            error={!!errors?.password?.message}
            helperText={errors?.password?.message}
            fullWidth
            sx={{
              // Hide browser's default password reveal (Edge, IE)
              "& input::-ms-reveal": { display: "none" },
              "& input::-ms-clear": { display: "none" },
              // Hide browser's default password reveal (Safari)
              "& input::-webkit-textfield-decoration-container": { display: "none" },
              "& input::-webkit-credentials-auto-fill-button": {
                visibility: "hidden",
                display: "none",
                pointerEvents: "none",
                height: 0,
                width: 0,
                margin: 0,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? "hide password" : "show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            size="large"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isPending || isSuccess}
            endIcon={isPending || isSuccess ? <CircularProgress size={18} /> : undefined}
            onClick={handleSubmit(handleLogin)}
            type="submit"
            form="login-form"
          >
            {isPending && t("Login.Loading")}
            {isSuccess && t("Login.LoginSuccess")}
            {!isPending && !isSuccess && t("Login.Login")}
          </Button>

          <Box display="flex" justifyContent="center">
            <Button
              disabled={isPendingForgetPassword}
              endIcon={
                isPendingForgetPassword ? (
                  <CircularProgress size={16} />
                ) : undefined
              }
              variant="text"
              onClick={handleForgetPhase}
              size="small"
            >
              {t("Login.ForgotPassword")}
            </Button>
          </Box>

          {!!loginOptionAlternatives && loginOptionAlternatives.length > 0 && (
            <Box mt={1}>
              <AnotherCheckingWay
                loginOptionAlternatives={loginOptionAlternatives}
                handleSetStep={handleSetStep}
              />
            </Box>
          )}
        </Stack>
        <ErrorDialog
          isOpen={isOpen}
          handleClose={handleClose}
          desc={errorMessage}
        />
      </Box>
    </>
  );
};

export default PasswordPhase;
