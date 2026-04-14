"use client";

import { useFormContext } from "react-hook-form";
import { LoginType } from "../../validator/login-schema";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LOGIN_PHASES, LoginPhase } from "../../constant/login-phase";
import { useResetPassword } from "../../store/mutations";
import { useTranslations } from "next-intl";
import LoadingBackdrop from "@/components/shared/loading-backdrop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "sonner";

const ResetPasswordPhase = ({
  handleSetStep,
  handleStepBack,
}: {
  handleSetStep: (step: LoginPhase) => void;
  handleStepBack: () => void;
}) => {
  const t = useTranslations();
  const { mutate, isPending } = useResetPassword();
  const {
    formState: { errors },
    handleSubmit,
    register,
    getValues,
    reset,
    trigger,
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
        onError: (error: any) => {
          // Extract backend error message - prioritize password error
          if (error?.response?.data?.errors?.password) {
            toast.error(error.response.data.errors.password[0]);
          } else if (error?.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error(t("ResetPassword.GenericError"));
          }
        },
      },
    );
  };

  // Handle real-time validation without toast
  const handlePasswordChange = () => {
    trigger("newPassword");
  };

  const handleConfirmPasswordChange = () => {
    trigger("confirmNewPassword");
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
        <Stack spacing={2.5}>
          <Typography variant="h5" textAlign="center">
            {t("ResetPassword.Title")}
          </Typography>
          <TextField
            type="password"
            label={t("ResetPassword.NewPassword")}
            {...register("newPassword", {
              onChange: () => handlePasswordChange(),
            })}
            error={!!errors?.newPassword?.message}
            helperText={errors?.newPassword?.message}
            fullWidth
          />
          <Typography color="text.secondary" sx={{ opacity: 0.7 }}>
            {t("ResetPassword.PasswordRequirements")}
          </Typography>
          <TextField
            type="password"
            label={t("ResetPassword.ConfirmNewPassword")}
            {...register("confirmNewPassword", {
              onChange: () => handleConfirmPasswordChange(),
            })}
            error={!!errors?.confirmNewPassword?.message}
            helperText={errors?.confirmNewPassword?.message}
            fullWidth
          />
        </Stack>
        <Button
          disabled={isPending}
          endIcon={isPending ? <CircularProgress size={18} /> : undefined}
          onClick={handleSubmit(onSubmit)}
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          form="login-form"
          sx={{ mt: 2 }}
        >
          {t("ResetPassword.Confirm")}
        </Button>
      </Box>
    </>
  );
};

export default ResetPasswordPhase;
