import React from "react";
import { Input } from "@/modules/table/components/ui/input";
import { useLocale } from "next-intl";

// modular components handling specific UI logic
import PreviewTextFieldPrefixIcon from "./prefix-icon";
import PreviewTextFieldLabel from "./label";
import PreviewTextFieldSuffixIcon from "./suffix-icon";
import PreviewTextFieldValidationIcon from "./validation-icon";

// types
export type PreviewTextFieldType = "pdf" | "image" | "select" | "date";

// props type
type PropsT = {
  value: string;
  valid: boolean;
  type?: PreviewTextFieldType;
  label?: string;
  required?: boolean;
  fileUrl?: string;
};

const PreviewTextField = ({ label, type, value, valid, required }: PropsT) => {
  // get current locale for RTL/LTR
  const locale = useLocale();
  const isRTL = locale === "ar";

  // dynamically position icons and labels based on text direction
  const spanDir = isRTL ? "left-[15px]" : "right-[15px]";
  const labelDir = isRTL ? "right-[15px]" : "left-[15px]";

  return (
    <div className="relative">
      {/* input field with prefix icon */}
      <div className="flex w-full items-center gap-1">
        <PreviewTextFieldPrefixIcon type={type} />
        <Input disabled type="text" value={value ?? ""} />
      </div>

      {/* label with optional asterisk for required fields */}
      <PreviewTextFieldLabel
        labelDir={labelDir}
        label={label}
        required={required}
      />

      {/* suffix icon */}
      <PreviewTextFieldSuffixIcon isRTL={isRTL} type={type} />

      {/* icon showing validation state */}
      <PreviewTextFieldValidationIcon valid={valid} spanDir={spanDir} />
    </div>
  );
};

export default PreviewTextField;
