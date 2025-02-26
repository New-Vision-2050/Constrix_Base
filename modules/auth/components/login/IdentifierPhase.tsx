"use client";
import { useFormContext } from "react-hook-form";
import { IdentifierType } from "../../validator/loginSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LOGIN_PHASES, LoginPhase } from "../../constant/loginPhases";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useLoginWays } from "../../store/mutations";


const IdentifierPhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
  const { mutateAsync, isError, error, isPending } = useLoginWays();

  const [value, setValue] = useState("pass");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useFormContext<IdentifierType>();

  console.log({ isError, error, isPending });

  const onSubmit = async (data: IdentifierType) => {
    await mutateAsync({ identifier: data.identifier });
    /*   switch (value) {
      case "pass":
        handleSetStep(LOGIN_PHASES.PASSWORD);
        break;
      case "email":
        handleSetStep(LOGIN_PHASES.VALIDATE_EMAIL);
        break;
      case "phone":
        handleSetStep(LOGIN_PHASES.VALIDATE_PHONE);
        break;
      default:
        return;
    } */
  };

  return (
    <>
      <h1 className="text-2xl text-center">تسجيل الدخول</h1>

      <RadioGroup
        onValueChange={(s: string) => setValue(s)}
        defaultValue={value}
      >
        <div className="flex items-center gap-3">
          <RadioGroupItem value="pass" id="pass" />
          <label htmlFor="pass">كلمة المرور</label>
        </div>{" "}
        <div className="flex items-center gap-3">
          <RadioGroupItem value="email" id="email" />
          <label htmlFor="email">البريد الالكتروني</label>
        </div>{" "}
        <div className="flex items-center gap-3">
          <RadioGroupItem value="phone" id="phone" />
          <label htmlFor="phone">رقم الجوال</label>
        </div>
      </RadioGroup>

      <Input
        {...register("identifier")}
        label="رقم الجوال / البريد الالكتروني / رقم المعرف (يحدد من الاعدادات)"
        error={errors?.identifier?.message}
      />
      <Button size={"lg"} className="w-full" onClick={handleSubmit(onSubmit)}>
        التالي
      </Button>
    </>
  );
};

export default IdentifierPhase;
