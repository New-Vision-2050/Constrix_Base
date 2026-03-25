import { LOGIN_PHASES, LoginPhase } from "../../constant/login-phase";
import {
  ChangeEmailType,
  ValidateEmailType,
} from "../../validator/login-schema";
import { useFormContext } from "react-hook-form";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ChangeEmailPhase = ({
  handleSetStep,
  handleStepBack,
}: {
  handleSetStep: (step: LoginPhase) => void;
  handleStepBack: () => void;
}) => {
  const t = useTranslations();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useFormContext<ChangeEmailType & ValidateEmailType>();

  const onSubmit = () => {
    setValue("validateEmailOtp", "");
    handleSetStep(LOGIN_PHASES.VALIDATE_EMAIL);
  };

  const handleReturn = () => {
    setValue("newEmail", "");
    handleSetStep(LOGIN_PHASES.IDENTIFIER);
  };

  return (
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
          {t("ChangeEmail.Title")}
        </Typography>
        <TextField
          label={t("ChangeEmail.NewEmail")}
          {...register("newEmail")}
          error={!!errors?.newEmail?.message}
          helperText={errors?.newEmail?.message}
          fullWidth
        />
        <TextField
          label={t("ChangeEmail.ConfirmNewEmail")}
          {...register("confirmNewEmail")}
          error={!!errors?.confirmNewEmail?.message}
          helperText={errors?.confirmNewEmail?.message}
          fullWidth
        />
        <Typography color="text.secondary" sx={{ opacity: 0.7 }}>
          {t("ChangeEmail.NoCopy")}
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Button
            type="submit"
            form="login-form"
            onClick={handleSubmit(onSubmit)}
            fullWidth
            variant="contained"
            color="primary"
          >
            {t("ChangeEmail.Confirm")}
          </Button>
          <Button
            onClick={handleReturn}
            type="button"
            variant="text"
            sx={{ width: "fit-content", textDecoration: "underline", textTransform: "none" }}
          >
            {t("ChangeEmail.BackToLogin")}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default ChangeEmailPhase;
