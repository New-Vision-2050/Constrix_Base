"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, TextField, Typography } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  deleteEmailSchema,
  DeleteEmailType,
} from "../../validator/delete-email-schema";

const fakeDeleteEmailApi = (_data: DeleteEmailType): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 1200));

const DeleteEmailForm = () => {
  const t = useTranslations("DeleteEmail");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DeleteEmailType>({
    resolver: zodResolver(deleteEmailSchema),
    defaultValues: { firstName: "", lastName: "", email: "" },
  });

  const onSubmit = async (data: DeleteEmailType) => {
    await fakeDeleteEmailApi(data);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <Stack spacing={3} alignItems="center" textAlign="center" py={2}>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle2 className="h-9 w-9 text-green-600 dark:text-green-400" />
        </div>

        <div>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            {t("SuccessTitle")}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 1.5, lineHeight: 1.7 }}
          >
            {t("SuccessMessage")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {t("ContactInfo")}
          </Typography>
        </div>
      </Stack>
    );
  }

  return (
    <>
      <Stack spacing={1} alignItems="center" mb={3}>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <Mail className="h-7 w-7 text-destructive" />
        </div>
        <Typography variant="h5" textAlign="center" fontWeight={700}>
          {t("Title")}
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          color="text.secondary"
          sx={{ lineHeight: 1.7, maxWidth: 380 }}
        >
          {t("Description")}
        </Typography>
      </Stack>

      <Stack
        component="form"
        spacing={2.5}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Stack direction="row" spacing={2}>
          <TextField
            {...register("firstName")}
            label={t("FirstName")}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            fullWidth
          />
          <TextField
            {...register("lastName")}
            label={t("LastName")}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            fullWidth
          />
        </Stack>

        <TextField
          {...register("email")}
          label={t("Email")}
          type="email"
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
        />

        <Button
          type="submit"
          variant="destructive"
          size="lg"
          disabled={isSubmitting}
          className="h-11 w-full rounded-lg border-0 px-4 text-base font-bold shadow-none disabled:opacity-70 [&_svg]:size-[18px]"
        >
          {isSubmitting ? (
            <>
              {t("Loading")}
              <Loader2 className="animate-spin" aria-hidden />
            </>
          ) : (
            t("Submit")
          )}
        </Button>
      </Stack>
    </>
  );
};

export default DeleteEmailForm;
