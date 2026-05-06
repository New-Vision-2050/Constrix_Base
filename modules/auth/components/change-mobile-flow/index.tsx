"use client";

import { useState } from "react";
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
import { countryCodes } from "@/constants/countries-codes";

type Step = "mobile" | "otp";

const ChangeMobileFlow = () => {
  const t = useTranslations();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [step, setStep] = useState<Step>("mobile");
  const [countryCode, setCountryCode] = useState("+966");
  const [newPhone, setNewPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [newIdentifier, setNewIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  const handlePhoneSubmit = async () => {
    if (!newPhone.trim()) {
      setPhoneError(t("ChangeMobile.NewMobile") + " مطلوب");
      return;
    }
    setPhoneError("");
    const identifier = `${countryCode}${newPhone}`;
    try {
      setLoading(true);
      await apiClient.post(`/company-users/send-otp`, {
        identifier,
        type: "phone",
      });
      setNewIdentifier(identifier);
      setStep("otp");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || t("ChangeMobile.GenericError")
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
        { identifier: newIdentifier, otp, type: "phone" }
      );
      toast.success(t("ChangeMobile.Success"));
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
        identifier: newIdentifier,
        type: "phone",
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || t("ChangeMobile.GenericError")
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
            onClick={() => setStep("mobile")}
            type="button"
            aria-label="go-back"
          >
            <ArrowBackIcon />
          </IconButton>

          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h4" fontWeight={600} textAlign="center">
                {t("Login.PhoneVerification.Title")}
              </Typography>
              <Typography component="p" textAlign="center">
                <Typography
                  component="span"
                  color="text.secondary"
                  sx={{ opacity: 0.7 }}
                >
                  {t("Login.PhoneVerification.EnterVerificationCode")}{" "}
                </Typography>
                <Typography component="span" dir="ltr">
                  {newIdentifier}
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
            {t("ChangeMobile.Title")}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="flex-start">
            <Box
              component="select"
              value={countryCode}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setCountryCode(e.target.value)
              }
              sx={{
                height: "56px",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
                color: "text.primary",
                px: 1,
                fontSize: "0.875rem",
                cursor: "pointer",
                minWidth: "110px",
                "&:focus": { outline: "none" },
              }}
            >
              {countryCodes.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.flag} {c.code}
                </option>
              ))}
            </Box>

            <TextField
              type="tel"
              label={t("ChangeMobile.NewMobile")}
              value={newPhone}
              onChange={(e) => {
                setNewPhone(e.target.value.replace(/[^\d]/g, ""));
                setPhoneError("");
              }}
              error={!!phoneError}
              helperText={phoneError}
              fullWidth
              inputProps={{ dir: "ltr" }}
            />
          </Stack>
        </Stack>

        <Button
          disabled={loading}
          endIcon={loading ? <CircularProgress size={18} /> : undefined}
          onClick={handlePhoneSubmit}
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 4, py: 1.5, fontSize: "1rem", fontWeight: 600 }}
        >
          {t("ChangeMobile.ChangeMobile")}
        </Button>
      </Box>
    </>
  );
};

export default ChangeMobileFlow;
