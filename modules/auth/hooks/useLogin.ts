import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema, LoginType } from "../validator/loginSchema";
import { LOGIN_PHASES, LoginPhase } from "../constant/loginPhases";
import { formDefaultValues } from "../constant/defaultValues";

const useLogin = () => {
  const [step, setStep] = useState<LoginPhase>(LOGIN_PHASES.IDENTIFIER);
  const form = useForm<LoginType>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(loginSchema[step] as any),
    defaultValues: formDefaultValues,
  });
  const { getValues } = form;

  const onSubmit = () => {
    const allData = getValues();
    switch (step) {
      case LOGIN_PHASES.IDENTIFIER:
        setStep(LOGIN_PHASES.PASSWORD);
        break;
      case LOGIN_PHASES.PASSWORD:
        console.log("Form submitted:", allData);
        break;
      default:
        console.log("Form submitted:", allData);
        break;
    }

    /* 
    if (step < loginSchema.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      console.log("Form submitted:", allData);
      setStep((prev) => prev + 1);
    } */
  };

  const handleSetStep = (step: LoginPhase) => {
    setStep(step);
  };

  return {
    step,
    form,
    onSubmit,
    handleSetStep,
  };
};

export default useLogin;
