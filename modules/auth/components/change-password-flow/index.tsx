"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAuthStore } from "@/modules/auth/store/use-auth";
import {
  useLoginWays,
  useLoginSteps,
  useResetPassword,
} from "@/modules/auth/store/mutations";
import LoadingBackdrop from "@/components/shared/loading-backdrop";
import { useRouter } from "@i18n/navigation";
import { ROUTER } from "@/router";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import { createPasswordValidation, getMessage } from "@/utils/zodTranslations";

const changePasswordSchema = z.object({
  old_password: z.string().min(1, getMessage("passwordRequired") as string),
  newPassword: createPasswordValidation(),
});

type ChangePasswordFormType = z.infer<typeof changePasswordSchema>;

const ChangePasswordFlow = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const { mutate: loginWaysMutate, isPending: isLoginWaysPending } =
    useLoginWays();
  const { mutate: loginStepsMutate, isPending: isLoginStepsPending } =
    useLoginSteps();
  const { mutate: resetPasswordMutate, isPending: isResetPasswordPending } =
    useResetPassword();

  const isPending =
    isLoginWaysPending || isLoginStepsPending || isResetPasswordPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm<ChangePasswordFormType>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordFormType) => {
    const identifier = user?.email ?? "";

    loginWaysMutate(
      { identifier },
      {
        onSuccess: (waysData) => {
          const token = waysData.payload.token;

          loginStepsMutate(
            { identifier, password: data.old_password, token },
            {
              onSuccess: (stepsData) => {
                const resetToken = stepsData.payload.token;

                resetPasswordMutate(
                  {
                    identifier,
                    password: data.newPassword,
                    password_confirmation: data.newPassword,
                    token: resetToken,
                  },
                  {
                    onSuccess: () => {
                      toast.success(t("ResetPassword.Success"));
                      reset();
                      router.push(ROUTER.DASHBOARD);
                    },
                    onError: (error: any) => {
                      if (error?.response?.data?.errors?.password) {
                        toast.error(
                          error.response.data.errors.password[0]
                        );
                      } else {
                        toast.error(
                          error?.response?.data?.message ||
                            t("ResetPassword.GenericError")
                        );
                      }
                    },
                  }
                );
              },
              onError: (error: any) => {
                toast.error(
                  error?.response?.data?.message ||
                    t("ResetPassword.GenericError")
                );
              },
            }
          );
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || t("ResetPassword.GenericError")
          );
        },
      }
    );
  };

  return (
    <>
      <LoadingBackdrop open={isPending} />
      <Box sx={{ position: "relative", width: "100%" }}>
          <IconButton
              sx={{
                  position: "absolute",
                  top: 0,
                  ...(isRTL ? { right: 460 } : { left: 0 }),
                  zIndex: 1,
              }}
              onClick={() => router.back()}
              aria-label="go-back"
          >
              {isRTL ? <ArrowForwardIcon /> : <ArrowBackIcon />}
          </IconButton>

        <Stack spacing={7}>
          <Typography variant="h4" textAlign="center" fontWeight={600} mb={1}>
              {t("ResetPassword.Title")}
          </Typography>

          <TextField
            type="password"
            label={t("ResetPassword.CurrentPassword")}
            {...register("old_password")}
            error={!!errors.old_password}
            helperText={errors.old_password?.message}
            fullWidth
          />

          <TextField
            type="password"
            label={t("ResetPassword.NewPassword")}
            {...register("newPassword", {
              onChange: () => trigger("newPassword"),
            })}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            fullWidth
          />

          <Typography color="text.secondary" sx={{ opacity: 0.7, fontSize: "0.85rem" }}>
            {t("ResetPassword.PasswordRequirements")}
          </Typography>
        </Stack>

        <Button
          disabled={isPending}
          endIcon={isPending ? <CircularProgress size={18} /> : undefined}
          onClick={handleSubmit(onSubmit)}
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 4, py: 1.5, fontSize: "1rem", fontWeight: 600 }}
        >
          {t("ResetPassword.Confirm")}
        </Button>
      </Box>
    </>
  );
};

export default ChangePasswordFlow;
