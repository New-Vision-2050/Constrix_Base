import { Controller, useFormContext } from "react-hook-form";
import {
  IdentifierType,
  ValidatePhoneType,
} from "../../validator/login-schema";
import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";

const ValidatePhonePhase = ({
  handleSetStep,
}: {
  handleSetStep: (step: LoginPhase) => void;
}) => {
  const router = useRouter();

  const { mutate, isPending } = useLoginSteps();

  const {
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    setValue,
  } = useFormContext<IdentifierType & ValidatePhoneType>();
  const identifier = getValues("identifier");

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
            useAuthStore
              .getState()
              .setUser(data.payload.user, data.payload.token);
            router.push("/companies");
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
          console.log(error);
        },
      }
    );
  };

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-2xl text-start">التحقق من رقم الجوال</h1>
        <p>
          <span className="opacity-50">ادخل رمز التحقق المرسل الى </span>
          {identifier}
        </p>
      </div>
      <Controller
        name="validatePhoneOtp"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col px-4">
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
          </div>
        )}
      />
      <Button
        loading={isPending}
        onClick={handleSubmit(onSubmit)}
        className="w-full"
      >
        دخول
      </Button>
      <OtpHub resendFor="resend-otp" identifier={identifier} />

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={"link"}
          className="text-primary p-0 h-auto underline"
        >
          تغيير رقم الجوال{" "}
        </Button>

        <AnotherCheckingWay />
      </div>
    </>
  );
};

export default ValidatePhonePhase;
