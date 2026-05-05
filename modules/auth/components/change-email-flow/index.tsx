"use client";

import { useState } from "react";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputError,
} from "@/components/ui/input-otp";
import { useAuthStore } from "@/modules/auth/store/use-auth";
import { apiClient } from "@/config/axios-config";
import LoadingBackdrop from "@/components/shared/loading-backdrop";
import { useRouter } from "@i18n/navigation";
import { ROUTER } from "@/router";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const emailSchema = z.object({
  newEmail: z
    .string()
    .min(1, "البريد الالكتروني مطلوب")
    .email("البريد الالكتروني غير صالح"),
});

type EmailFormType = z.infer<typeof emailSchema>;

type Step = "email" | "otp";

const ChangeEmailFlow = () => {
  const t = useTranslations();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [step, setStep] = useState<Step>("email");
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormType>({
    resolver: zodResolver(emailSchema),
  });

  const onEmailSubmit = async (data: EmailFormType) => {
    try {
      setLoading(true);
      await apiClient.post(`/company-users/send-otp`, {
        identifier: data.newEmail,
        type: "email",
      });
      setNewEmail(data.newEmail);
      setStep("otp");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || t("ResetPassword.GenericError")
      );
    } finally {
      setLoading(false);
    }
  };

  const onOtpSubmit = async () => {
    try {
      setOtpError("");
      setLoading(true);
      await apiClient.post(
        `/company-users/validate-otp${user?.id ? "/" + user.id : ""}`,
        { identifier: newEmail, otp, type: "email" }
      );
      toast.success("تم تغيير البريد الالكتروني بنجاح");
      router.push(ROUTER.DASHBOARD);
    } catch (error: any) {
      setOtpError("كلمة المرور المؤقتة غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      await apiClient.post(`/company-users/send-otp`, {
        identifier: newEmail,
        type: "email",
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || t("ResetPassword.GenericError")
      );
    } finally {
      setLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <>
        <LoadingBackdrop open={loading} />
        <Box position="relative">
          <IconButton
            sx={{ position: "absolute", top: 0, left: 0 }}
            onClick={() => setStep("email")}
            type="button"
            aria-label="go-back"
          >
            <ArrowBackIcon />
          </IconButton>

          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h4" fontWeight={600} textAlign="center">
                {t("Login.EmailVerification.Title")}
              </Typography>
              <Typography component="p" textAlign="center">
                <Typography
                  component="span"
                  color="text.secondary"
                  sx={{ opacity: 0.7 }}
                >
                  {t("Login.EmailVerification.EnterVerificationCode")}{" "}
                </Typography>
                <Typography component="span" dir="ltr">
                  {newEmail}
                </Typography>
              </Typography>
            </Stack>

            <Box display="flex" flexDirection="column" alignItems="center" px={2}>
              <div dir="ltr">
                <InputOTP maxLength={5} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <InputError error={otpError} />
            </Box>

            <Button
              variant="text"
              onClick={handleResend}
              disabled={loading}
              sx={{ alignSelf: "center" }}
            >
              {t("Login.PhoneVerification.ResendCode")}
            </Button>
          </Stack>

          <Button
            disabled={loading || otp.length < 5}
            endIcon={loading ? <CircularProgress size={18} /> : undefined}
            onClick={onOtpSubmit}
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
  }

  return (
    <>
      <LoadingBackdrop open={loading} />
      <Box position="relative">
        <IconButton
          sx={{ position: "absolute", top: 0, left: 0 }}
          onClick={() => router.back()}
          type="button"
          aria-label="go-back"
        >
          <ArrowBackIcon />
        </IconButton>

        <Stack spacing={3}>
          <Typography variant="h4" textAlign="center" fontWeight={600} mb={1}>
            {t("ChangeEmail.Title")}
          </Typography>

          <TextField
            label="البريد الالكتروني الحالي"
            value={user?.email ?? ""}
            InputProps={{ readOnly: true }}
            fullWidth
            disabled
          />

          <TextField
            type="email"
            label={t("ChangeEmail.NewEmail")}
            {...register("newEmail")}
            error={!!errors.newEmail}
            helperText={errors.newEmail?.message}
            fullWidth
          />
        </Stack>

        <Button
          disabled={loading}
          endIcon={loading ? <CircularProgress size={18} /> : undefined}
          onClick={handleSubmit(onEmailSubmit)}
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 4, py: 1.5, fontSize: "1rem", fontWeight: 600 }}
        >
          {t("ChangeEmail.Confirm")}
        </Button>
      </Box>
    </>
  );
};

export default ChangeEmailFlow;
