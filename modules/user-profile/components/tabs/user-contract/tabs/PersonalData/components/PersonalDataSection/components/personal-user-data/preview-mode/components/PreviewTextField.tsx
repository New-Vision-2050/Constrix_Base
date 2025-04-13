import React from "react";
import { Input } from "@/modules/table/components/ui/input";
import InfoIcon from "@/public/icons/InfoIcon";
import { useLocale } from "next-intl";
import { Asterisk, CircleCheckIcon } from "lucide-react";

type PropsT = {
  value: string;
  valid: boolean;
  select?: boolean;
  label?: string;
  required?: boolean;
};

const PreviewTextField = ({ label, value, valid, required }: PropsT) => {
  const locale = useLocale();
  const spanDir = locale !== "ar" ? "right-[15px]" : "left-[15px]";
  const labelDir = locale === "ar" ? "right-[15px]" : "left-[15px]";

  return (
    <div className="relative">
      <div className="flex w-full">
        <Input disabled type="text" value={value} />
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
      <span className={`absolute top-[8px] ${spanDir}`}>
        {valid ? (
          <CircleCheckIcon color="green" />
        ) : (
          <InfoIcon additionClass="text-orange-500" />
        )}
      </span>
    </div>
  );
};

export default PreviewTextField;
