"use client";

import { FormProvider } from "react-hook-form";
import useLogin from "../../_hooks/useLogin";
import IdentifierPhase from "./IdentifierPhase";
import PasswordPhase from "./PasswordPhase";
import { LOGIN_PHASES } from "../../constant";
import ForgetPasswordPhase from "./ForgetPasswordPhase";
import ResetPasswordPhase from "./ResetPasswordPhase";
import ValidateEmailPhase from "./ValidateEmailPhase";
import SecurityQuestionsPhase from "./SecurityQuestionsPhase";
import ChangeEmailPhase from "./ChangeEmailPhase";
import ValidatePhonePhase from "./ValidatePhonePhase";

const LoginProvider = () => {
  const { form, step, handleSetStep } = useLogin();

  return (
    <FormProvider {...form}>
      <form className="space-y-8">
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
        )}{" "}
        {step === LOGIN_PHASES.CHANGE_EMAIL && (
          <ChangeEmailPhase handleSetStep={handleSetStep} />
        )}{" "}
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
