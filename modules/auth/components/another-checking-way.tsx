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
import { useTranslations } from "next-intl";

const AnotherCheckingWay = memo(
  ({
    loginOptionAlternatives,
    handleSetStep,
  }: {
    loginOptionAlternatives: string[] | null;
    handleSetStep: (step: LoginPhase) => void;
  }) => {
    const t = useTranslations("Login.Verification");
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
      setValue("by", res.payload.login_way.by);
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
        label: t("Mobile"),
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
        label: t("Password"),
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
        label: t("Email"),
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
        label: t("Social"),
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
      /*     { id: 5, label: t("Barcode"), icon: <BarCodeIcon />, func: () => null },
      {
        id: 6,
        label: t("LocalNetwork"),
        icon: <NetworkIcon />,
        func: () => null,
      }, */
    ];

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="underline group flex items-center gap-1 text-sm sm:text-base">
          {t("ChooseAnotherMethod")}
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 transition group-data-[state=open]:rotate-180" />
        </DropdownMenuTrigger>
        {isPending && <LoadingSpinner />}
        <DropdownMenuContent className="min-w-[200px]">
          <DropdownMenuLabel className="text-center">
            {t("VerifyVia")}
          </DropdownMenuLabel>
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
    );
  }
);

AnotherCheckingWay.displayName = "AnotherCheckingWay";

export default AnotherCheckingWay;
