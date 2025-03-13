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

const LoginProvider = () => {
  const { form, step, handleSetStep } = useLogin();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Handle form submission based on current step
    if (step === LOGIN_PHASES.IDENTIFIER) {
      const identifierPhaseElement = document.querySelector('button[form="login-form"]') as HTMLButtonElement;
      if (identifierPhaseElement) {
        identifierPhaseElement.click();
      }
    } else if (step === LOGIN_PHASES.PASSWORD) {
      const passwordPhaseElement = document.querySelector('button[form="login-form"]') as HTMLButtonElement;
      if (passwordPhaseElement) {
        passwordPhaseElement.click();
      }
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
          <PasswordPhase handleSetStep={handleSetStep} />
        )}
        {step === LOGIN_PHASES.FORGET_PASSWORD && (
          <ForgetPasswordPhase handleSetStep={handleSetStep} />
        )}
        {step === LOGIN_PHASES.RESET_PASSWORD && (
          <ResetPasswordPhase handleSetStep={handleSetStep} />
        )}
        {/* End Password Flow */}
        {/* Start Email Flow */}
        {step === LOGIN_PHASES.VALIDATE_EMAIL && (
          <ValidateEmailPhase handleSetStep={handleSetStep} />
        )}
        {step === LOGIN_PHASES.SECURITY_QUESTIONS && (
          <SecurityQuestionsPhase handleSetStep={handleSetStep} />
        )}
        {step === LOGIN_PHASES.CHANGE_EMAIL && (
          <ChangeEmailPhase handleSetStep={handleSetStep} />
        )}
        {/* End Email Flow */}
        {/* Start Phone Flow */}
        {step === LOGIN_PHASES.VALIDATE_PHONE && (
          <ValidatePhonePhase handleSetStep={handleSetStep} />
        )}
      </form>
    </FormProvider>
  );
};

export default LoginProvider;
