import { Controller, useFormContext } from "react-hook-form";
import {
  IdentifierType,
  ValidatePhoneType,
} from "../../validator/login-schema";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AnotherCheckingWay from "../another-checking-way";
import {
  InputError,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LOGIN_PHASES, LoginPhase } from "../../constant/login-phase";
import { useLoginSteps } from "../../store/mutations";
import OtpHub from "../resend-otp/otp-hub";
import { useAuthStore } from "../../store/use-auth";
import { useRouter } from "@i18n/navigation";
import { setCookie } from "cookies-next";
import { ROUTER } from "@/router";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useModal } from "@/hooks/use-modal";
import ErrorDialog from "@/components/shared/error-dialog";
import { getErrorMessage } from "@/utils/errorHandler";
import LoadingBackdrop from "@/components/shared/loading-backdrop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ValidatePhonePhase = ({
  handleSetStep,
  handleStepBack,
}: {
  handleSetStep: (step: LoginPhase) => void;
  handleStepBack: () => void;
}) => {
  const t = useTranslations("Login.PhoneVerification");
  const loginT = useTranslations("Login");
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, handleOpen, handleClose] = useModal();

  const { mutate, isPending } = useLoginSteps();

  const {
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    setValue,
  } = useFormContext<IdentifierType & ValidatePhoneType>();
  const identifier = getValues("identifier");
  const token = getValues("token");
  const by = getValues("by");

  const loginOptionAlternatives = getValues("login_option_alternatives");

  const onSubmit = () => {
    const data = getValues();

    mutate(
      {
        identifier: data.identifier,
        password: data.validatePhoneOtp,
        token: data.token ?? "",
      },
      {
        onSuccess: (data, variable) => {
          setValue("token", data.payload.token);
          if (!data.payload.login_way.step) {
            useAuthStore.getState().setUser(data.payload.user);
            setCookie("new-vision-token", data.payload.token, {
              maxAge: 7 * 24 * 60 * 60,
              path: "/",
            });
            router.push(ROUTER.COMPANIES);
            return;
          }
          const nextStep = data.payload.login_way.step?.login_option;
          switch (nextStep) {
            case "password":
              handleSetStep(LOGIN_PHASES.PASSWORD);
              break;
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
        onError: (error) => {
          const messageKey = getErrorMessage(error);
          setErrorMessage(
            messageKey || t("Errors.Authentication.InvalidIdentifier"),
          );
          handleOpen();
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
          <Stack spacing={1}>
            <Typography variant="h5" textAlign="left">
              {t("Title")}
            </Typography>
            <Typography component="p">
              <Typography component="span" color="text.secondary" sx={{ opacity: 0.7 }}>
                {t("EnterVerificationCode")}{" "}
              </Typography>
              <Typography component="span" dir="ltr">
                {by}
              </Typography>
            </Typography>
          </Stack>
        <Controller
          name="validatePhoneOtp"
          control={control}
          render={({ field }) => (
            <Box display="flex" flexDirection="column" px={2}>
              <div dir="ltr">
                <InputOTP
                  maxLength={5}
                  value={field.value}
                  onChange={field.onChange}
                >
                  <InputOTPGroup>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        isError={!!errors?.validatePhoneOtp?.message}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <InputError error={errors?.validatePhoneOtp?.message} />
            </Box>
          )}
        />
        <Button
          disabled={isPending}
          endIcon={isPending ? <CircularProgress size={18} /> : undefined}
          onClick={handleSubmit(onSubmit)}
          type="submit"
          form="login-form"
          fullWidth
          variant="contained"
        >
          {loginT("Login")}
        </Button>
        <OtpHub
          resendFor="resend-otp"
          token={token ?? ""}
          identifier={identifier}
        />

        {!!loginOptionAlternatives && loginOptionAlternatives.length > 0 && (
          <AnotherCheckingWay
            loginOptionAlternatives={loginOptionAlternatives}
            handleSetStep={handleSetStep}
          />
        )}

        {/*       <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={"link"}
          className="text-primary p-0 h-auto underline"
        >
          {t("ChangePhoneNumber")}
        </Button>
        {!!loginOptionAlternatives && loginOptionAlternatives.length > 0 && (
          <AnotherCheckingWay
            loginOptionAlternatives={loginOptionAlternatives}
            handleSetStep={handleSetStep}
          />
        )}
      </div> */}
        <ErrorDialog
          isOpen={isOpen}
          handleClose={handleClose}
          desc={errorMessage}
        />
        </Stack>
      </Box>
    </>
  );
};

export default ValidatePhonePhase;
