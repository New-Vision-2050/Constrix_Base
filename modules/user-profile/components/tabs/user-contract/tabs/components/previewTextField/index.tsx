import React from "react";
import { Input } from "@/modules/table/components/ui/input";
import { useLocale } from "next-intl";

import { cn } from "@/lib/utils";

// modular components handling specific UI logic
import PreviewTextFieldPrefixIcon from "./prefix-icon";
import PreviewTextFieldLabel from "./label";
import PreviewTextFieldSuffixIcon from "./suffix-icon";
import PreviewTextFieldValidationIcon from "./validation-icon";
import { checkString } from "@/utils/check-string";
import { truncateString } from "@/utils/truncate-string";

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
  needRequest?: boolean;
  mediaId?: string | number;
  fireAfterDeleteMedia?: () => void;
};

const PreviewTextField = ({
  label,
  type,
  value,
  valid,
  fileUrl,
  required,
  needRequest,
  mediaId,
  fireAfterDeleteMedia,
}: PropsT) => {
  // get current locale for RTL/LTR
  const locale = useLocale();
  const isRTL = locale === "ar";

  // dynamically position icons and labels based on text direction
  const spanDir = isRTL ? "left-[15px]" : "right-[15px]";
  const labelDir = isRTL ? "right-[15px]" : "left-[15px]";

  // check incoming string is phone
  const isValidPhoneNumber = (input: string, minMainLength = 8) => {
    if (!input) return false;
    // Remove spaces, dashes, and parentheses
    const cleaned = input.replace(/[\s\-()]/g, "");

    // Remove leading '+' if exists
    const digitsOnly = cleaned.replace(/^\+/, "");

    // Optional: You can allow or disallow non-digit characters here
    if (!/^\d+$/.test(digitsOnly)) return false;

    // You can define acceptable phone number range (e.g., 8 to 15 digits total)
    // Or split between country code and main number
    // For now, just check minimum main phone number length
    return digitsOnly.length >= minMainLength;
  };

  return (
    <div
      className={cn(
        "relative grow",
        "border-2",
        "mb-6",
        needRequest && "bg-background"
      )}
    >
      {/* input field with prefix icon */}
      <div className="flex w-full items-center gap-1">
        <PreviewTextFieldPrefixIcon type={type} />
        {isValidPhoneNumber(value) ? (
          <span
            style={{
              direction: "ltr",
              unicodeBidi: "isolate",
              height: "40px",
              display: "flex",
              alignItems: "center",
              padding: "10px",
              color: "dimgray",
            }}
          >
            {value}
          </span>
        ) : (
          <Input
            disabled
            type="text"
            value={truncateString(checkString(value), 21)}
          />
        )}
      </div>

      {/* label with optional asterisk for required fields */}
      <PreviewTextFieldLabel
        labelDir={labelDir}
        label={label}
        required={required}
        needRequest={needRequest}
      />

      {/* suffix icon */}
      <PreviewTextFieldSuffixIcon
        fileUrl={fileUrl}
        isRTL={isRTL}
        type={type}
        mediaId={mediaId}
        fireAfterDeleteMedia={fireAfterDeleteMedia}
      />

      {/* icon showing validation state */}
      <PreviewTextFieldValidationIcon valid={valid} spanDir={spanDir} />
    </div>
  );
};

export default PreviewTextField;
