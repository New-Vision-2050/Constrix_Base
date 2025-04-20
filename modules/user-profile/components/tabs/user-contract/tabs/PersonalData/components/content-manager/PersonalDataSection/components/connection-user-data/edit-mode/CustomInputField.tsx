import React from "react";
import { useLocale } from "next-intl";
import { Asterisk } from "lucide-react";
import { Input } from "@/modules/table/components/ui/input";

type PropsT = {
  value: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (str: string) => void;
};

const CustomInputField = ({
  label,
  value,
  disabled,
  required,
  onChange,
}: PropsT) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const labelDir = isRTL ? "right-[15px]" : "left-[15px]";

  return (
    <div className="relative">
      <div className="flex w-full items-center gap-1">
        <Input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {/* label */}
      {label && (
        <span
          className={`absolute top-[-14px] text-[12px] ${labelDir} flex items-center text-gray-600`}
        >
          <span>{label}</span>
          {required === true && <Asterisk size={"12px"} color="red" />}
        </span>
      )}
    </div>
  );
};

export default CustomInputField;
