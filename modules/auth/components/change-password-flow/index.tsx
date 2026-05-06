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
import { useAuthStore } from "@/modules/auth/store/use-auth";
import { apiClient } from "@/config/axios-config";
import LoadingBackdrop from "@/components/shared/loading-backdrop";
import { useRouter } from "@i18n/navigation";
import { ROUTER } from "@/router";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    newPassword: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

type PasswordFormType = z.infer<typeof passwordSchema>;

const ChangePasswordFlow = () => {
  const t = useTranslations();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormType>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormType) => {
    try {
      setLoading(true);
      await apiClient.post(`/company-users/change-password${user?.id ? "/" + user.id : ""}`, {
        current_password: data.currentPassword,
        new_password: data.newPassword,
        new_password_confirmation: data.confirmPassword,
      });
      toast.success(t("ChangePassword.Success"));
      router.push(ROUTER.DASHBOARD);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || t("ChangePassword.GenericError")
      );
    } finally {
      setLoading(false);
    }
  };

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
            {t("ChangePassword.Title")}
          </Typography>

          <TextField
            type="password"
            label={t("ChangePassword.CurrentPassword")}
            {...register("currentPassword")}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
            fullWidth
          />

          <TextField
            type="password"
            label={t("ChangePassword.NewPassword")}
            {...register("newPassword")}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            fullWidth
          />

          <TextField
            type="password"
            label={t("ChangePassword.ConfirmNewPassword")}
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            fullWidth
          />
        </Stack>

        <Button
          disabled={loading}
          endIcon={loading ? <CircularProgress size={18} /> : undefined}
          onClick={handleSubmit(onSubmit)}
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 4, py: 1.5, fontSize: "1rem", fontWeight: 600 }}
        >
          {t("ChangePassword.Confirm")}
        </Button>
      </Box>
    </>
  );
};

export default ChangePasswordFlow;
