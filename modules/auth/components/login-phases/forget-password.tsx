"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  ForgetPasswordType,
  IdentifierType,
} from "../../validator/login-schema";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputError,
} from "@/components/ui/input-otp";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { LOGIN_PHASES, LoginPhase } from "../../constant/login-phase";
import OtpHub from "../resend-otp/otp-hub";
import { useValidateResetPasswordOtp } from "../../store/mutations";
import { useTranslations } from "next-intl";
import LoadingBackdrop from "@/components/shared/loading-backdrop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ForgetPasswordPhase = ({
  handleSetStep,
  handleStepBack,
}: {
  handleSetStep: (step: LoginPhase) => void;
  handleStepBack: () => void;
}) => {
  const t = useTranslations();
  const {
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    setValue,
  } = useFormContext<IdentifierType & ForgetPasswordType>();
  const { mutate, isPending, error } = useValidateResetPasswordOtp();
  const identifier = getValues("identifier");
  const token = getValues("token");
  const first_login = getValues("first_login");
  console.log("first_loginfirst_login", first_login);
  const onSubmit = () => {
    const otp = getValues("forgetPasswordOtp");

    mutate(
      { identifier, otp },
      {
        onSuccess: (res) => {
          setValue("token", res.payload.token);
          handleSetStep(LOGIN_PHASES.RESET_PASSWORD);
        },
      },
    );
  };

  return (
    <>
      <LoadingBackdrop open={isPending} />
      <Box position="relative">
        <IconButton
          sx={{ position: "absolute", top: 0, left: 0 }}
          onClick={() => handleStepBack()}
          type="button"
          aria-label="go-back"
        >
          <ArrowBackIcon />
        </IconButton>
        <Stack spacing={2}>
          <Typography variant="h5" textAlign="center">
            {first_login == "1"
              ? t("ForgotPassword.SetUpPassword")
              : t("ForgotPassword.Title")}
          </Typography>
          <Typography component="p">
            <Typography
              component="span"
              display="block"
              color="text.secondary"
              sx={{ opacity: 0.7 }}
            >
              {t("ForgotPassword.EnterTemporaryPassword")}
            </Typography>
            {identifier}
          </Typography>
          <Controller
            name="forgetPasswordOtp"
            control={control}
            render={({ field }) => (
              <Box display="flex" flexDirection="column" px={2}>
                <div dir="ltr">
                  <InputOTP
                    maxLength={5}
                    value={field.value}
                    onChange={(val) => {
                      const digitsOnly = val.replace(/\D/g, "");
                      field.onChange(digitsOnly);
                    }}
                  >
                    <InputOTPGroup>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          isError={!!errors?.forgetPasswordOtp?.message}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <InputError
                  error={
                    errors?.forgetPasswordOtp?.message ||
                    error?.response?.data?.error
                  }
                />
              </Box>
            )}
          />
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            endIcon={isPending ? <CircularProgress size={18} /> : undefined}
            type="submit"
            form="login-form"
            fullWidth
            variant="contained"
            color="primary"
          >
            {t("ForgotPassword.Confirm")}
          </Button>
          <OtpHub
            identifier={identifier}
            resendFor={"forget-password"}
            token={token ?? ""}
          />
        </Stack>
      </Box>
    </>
  );
};

export default ForgetPasswordPhase;
