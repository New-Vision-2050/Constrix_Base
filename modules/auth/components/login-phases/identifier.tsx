"use client";
import { useFormContext } from "react-hook-form";
import { IdentifierType } from "../../validator/login-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LOGIN_PHASES, LoginPhase } from "../../constant/login-phase";
import { useState } from "react";
import { useLoginWays } from "../../store/mutations";
import { useModal } from "../../../../hooks/use-modal";
import ErrorDialog from "@/components/shared/error-dialog";

const IdentifierPhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, handleOpen, handleClose] = useModal();
  const { mutate, isPending } = useLoginWays();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useFormContext<IdentifierType>();

  const onSubmit = (data: IdentifierType) => {
    mutate(
      { identifier: data.identifier },
      {
        onSuccess(data, variable) {
          setValue("token", data.payload.token);
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
        onError(error) {
          const description = error.response?.data?.message?.description;
          setErrorMessage(description ?? "حدث خطأ");
          handleOpen();
        },
      }
    );
  };

  return (
    <>
      <h1 className="text-2xl text-center">تسجيل الدخول</h1>
      <Input
        {...register("identifier")}
        label="رقم الجوال / البريد الالكتروني / رقم المعرف (يحدد من الاعدادات)"
        error={errors?.identifier?.message}
      />

      <Button
        size={"lg"}
        className="w-full"
        loading={isPending}
        onClick={handleSubmit(onSubmit)}
      >
        التالي
      </Button>

      <ErrorDialog
        isOpen={isOpen}
        handleClose={handleClose}
        desc={errorMessage}
      />
    </>
  );
};

export default IdentifierPhase;
