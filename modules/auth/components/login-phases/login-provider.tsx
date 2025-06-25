"use client";

import { FormProvider } from "react-hook-form";
import useLogin from "../../hook/use-login";
import IdentifierPhase from "./identifier";
import PasswordPhase from "./password";
import { LOGIN_PHASES } from "../../constant/login-phase";
import ForgetPasswordPhase from "./forget-password";
import ResetPasswordPhase from "./reset-password";
import ValidateEmailPhase from "./validate-email";
import SecurityQuestionsPhase from "./security-questions";
import ChangeEmailPhase from "./change-email";
import ValidatePhonePhase from "./validate-phone";
import { useEffect } from "react";
import fetchLoginAdmin from "@/modules/companies/api/fetch-login-admin";

const LoginProvider = () => {
  const { form, step, handleSetStep, handleStepBack } = useLogin();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      fetchLoginAdmin(token)
        .then((loginToken) => {
          document.cookie = `new-vision-token=${loginToken}; path=/; max-age=604800;`;
        })
        .then(() => {
          window.location.href = "/dashboard";
        })
        .catch((error) => {
          console.error("Failed to login as admin:", error);
        });
    }
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitButton = document.querySelector(
      'button[form="login-form"]'
    ) as HTMLButtonElement;
    if (submitButton) {
      submitButton.click();
    }
  };

  return (
    <FormProvider {...form}>
      <form
        id="login-form"
        className="space-y-6 sm:space-y-8"
        onSubmit={handleFormSubmit}
      >
        {step === LOGIN_PHASES.IDENTIFIER && (
          <IdentifierPhase handleSetStep={handleSetStep} />
        )}
        {/* Start Password Flow */}
        {step === LOGIN_PHASES.PASSWORD && (
          <PasswordPhase
            handleSetStep={handleSetStep}
            handleStepBack={handleStepBack}
          />
        )}
        {step === LOGIN_PHASES.FORGET_PASSWORD && (
          <ForgetPasswordPhase
            handleSetStep={handleSetStep}
            handleStepBack={handleStepBack}
          />
        )}
        {step === LOGIN_PHASES.RESET_PASSWORD && (
          <ResetPasswordPhase
            handleSetStep={handleSetStep}
            handleStepBack={handleStepBack}
          />
        )}
        {/* End Password Flow */}
        {/* Start Email Flow */}
        {step === LOGIN_PHASES.VALIDATE_EMAIL && (
          <ValidateEmailPhase
            handleSetStep={handleSetStep}
            handleStepBack={handleStepBack}
          />
        )}
        {step === LOGIN_PHASES.SECURITY_QUESTIONS && (
          <SecurityQuestionsPhase
            handleSetStep={handleSetStep}
            handleStepBack={handleStepBack}
          />
        )}
        {step === LOGIN_PHASES.CHANGE_EMAIL && (
          <ChangeEmailPhase
            handleSetStep={handleSetStep}
            handleStepBack={handleStepBack}
          />
        )}
        {/* End Email Flow */}
        {/* Start Phone Flow */}
        {step === LOGIN_PHASES.VALIDATE_PHONE && (
          <ValidatePhonePhase
            handleSetStep={handleSetStep}
            handleStepBack={handleStepBack}
          />
        )}
      </form>
    </FormProvider>
  );
};

export default LoginProvider;
