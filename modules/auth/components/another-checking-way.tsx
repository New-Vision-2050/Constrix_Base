"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MobileIcon from "@/public/icons/mobile";
import PassIcon from "@/public/icons/pass";
import { ChevronDown, CircleFadingPlus, Mail } from "lucide-react";
import { memo } from "react";
import { useFormContext } from "react-hook-form";
import { IdentifierType } from "../validator/login-schema";
import { useLoginAlternative } from "../store/mutations";
import { LoginWaysSuccessResponse } from "../types/login-responses";
import { LOGIN_PHASES, LoginPhase } from "../constant/login-phase";
import LoadingSpinner from "@/components/ui/loadding-dots";

const AnotherCheckingWay = memo(
  ({
    loginOptionAlternatives,
    handleSetStep,
  }: {
    loginOptionAlternatives: string[] | null;
    handleSetStep: (step: LoginPhase) => void;
  }) => {
    const { mutate, isPending } = useLoginAlternative();
    const { setValue, getValues } = useFormContext<IdentifierType>();
    const identifier = getValues("identifier");
    const token = getValues("token");

    const handleSuccess = (res: LoginWaysSuccessResponse) => {
      const nextStep = res.payload.login_way.step?.login_option;
      setValue("token", res.payload.token);
      setValue(
        "login_option_alternatives",
        res.payload.login_way.step.login_option_alternatives
      );
      switch (nextStep) {
        case "password":
          handleSetStep(LOGIN_PHASES.PASSWORD);
          break;
        case "otp":
          if (identifier.includes("@")) {
            handleSetStep(LOGIN_PHASES.VALIDATE_EMAIL);
          } else {
            handleSetStep(LOGIN_PHASES.VALIDATE_PHONE);
          }
          break;
        default:
          return;
      }
    };

    const menuItems = [
      {
        id: 0,
        label: "رقم الجوال",
        icon: <MobileIcon />,
        func: () =>
          mutate(
            { identifier, loginOption: "sms", token: token ?? "" },
            {
              onSuccess: handleSuccess,
            }
          ),
        optionKey: "sms",
      },
      {
        id: 1,
        label: "كلمة المرور",
        icon: <PassIcon />,
        func: () =>
          mutate(
            { identifier, loginOption: "password", token: token ?? "" },
            {
              onSuccess: handleSuccess,
            }
          ),
        optionKey: "password",
      },
      {
        id: 3,
        label: "البريد الإليكتروني",
        icon: <Mail className="text-primary" />,
        func: () =>
          mutate(
            { identifier, loginOption: "mail", token: token ?? "" },
            {
              onSuccess: handleSuccess,
            }
          ),
        optionKey: "mail",
      },
      {
        id: 4,
        label: "اجتماعي",
        icon: <CircleFadingPlus className="text-primary" />,
        func: () =>
          mutate(
            { identifier, loginOption: "social", token: token ?? "" },
            {
              onSuccess: handleSuccess,
            }
          ),
        optionKey: "social",
      },
      /*     { id: 5, label: "الباركود", icon: <BarCodeIcon />, func: () => null },
    {
      id: 6,
      label: "الشبكة المحلية",
      icon: <NetworkIcon />,
      func: () => null,
    }, */
    ];

    return (
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="underline group flex items-center gap-1 text-sm sm:text-base">
            او اختر طريقة تحقق اخرى
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 transition group-data-[state=open]:rotate-180" />
          </DropdownMenuTrigger>
          {isPending && <LoadingSpinner />}
          <DropdownMenuContent className="min-w-[200px]">
            <DropdownMenuLabel className="text-center">التحقق عن طريق</DropdownMenuLabel>
            {menuItems
              .filter((item) => loginOptionAlternatives?.includes(item.optionKey))
              .map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  className="gap-4 flex items-center justify-start"
                  onClick={item.func}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

AnotherCheckingWay.displayName = "AnotherCheckingWay";

export default AnotherCheckingWay;
