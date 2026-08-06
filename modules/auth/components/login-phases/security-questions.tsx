import { LOGIN_PHASES, LoginPhase } from "../../constant/login-phase";
import { SecurityQuestionsType } from "../../validator/login-schema";
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
import { useIsRtl } from "@/hooks/use-is-rtl";

const SecurityQuestionsPhase = ({
  handleSetStep,
  handleStepBack,
}: {
  handleSetStep: (step: LoginPhase) => void;
  handleStepBack: () => void;
}) => {
  const t = useTranslations();
  const isRtl = useIsRtl();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useFormContext<SecurityQuestionsType>();

  const onSubmit = () => {
    handleSetStep(LOGIN_PHASES.CHANGE_EMAIL);
  };

  return (
    <Box position="relative">
      <IconButton
        sx={{ position: "absolute", top: 0, insetInlineStart: 0 }}
        onClick={() => handleStepBack()}
        type="button"
        aria-label="go-back"
      >
        <ArrowBackIcon sx={{ transform: isRtl ? "scaleX(-1)" : "none" }} />
      </IconButton>
      <Stack spacing={2}>
        <Typography variant="h5" textAlign="center">
          {t("SecurityQuestions.Title")}
        </Typography>
        <TextField
          {...register("animal")}
          label={t("SecurityQuestions.PetQuestion")}
          error={!!errors?.animal?.message}
          helperText={errors?.animal?.message}
          fullWidth
        />
        <TextField
          {...register("team")}
          label={t("SecurityQuestions.TeamQuestion")}
          error={!!errors?.team?.message}
          helperText={errors?.team?.message}
          fullWidth
        />
        <Button
          size="large"
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          form="login-form"
          onClick={handleSubmit(onSubmit)}
        >
          {t("SecurityQuestions.Next")}
        </Button>
      </Stack>
    </Box>
  );
};

export default SecurityQuestionsPhase;
