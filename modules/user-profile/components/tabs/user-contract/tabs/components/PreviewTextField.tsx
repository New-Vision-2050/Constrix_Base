import React from "react";
import { Input } from "@/modules/table/components/ui/input";
import InfoIcon from "@/public/icons/InfoIcon";
import { useLocale } from "next-intl";
import { Asterisk, CircleCheckIcon } from "lucide-react";
import ChevronDownIcon from "@/public/icons/chevron-down-icon";
import CalendarRangeIcon from "@/public/icons/calendar-range";
import pdfImg from "@/assets/icons/PDF.png";

type PropsT = {
  value: string;
  valid: boolean;
  isPdf?: boolean;
  isDate?: boolean;
  isSelect?: boolean;
  label?: string;
  required?: boolean;
};

const PreviewTextField = ({
  label,
  value,
  isPdf,
  isDate,
  isSelect,
  valid,
  required,
}: PropsT) => {
  const locale = useLocale();
  const spanDir = locale !== "ar" ? "right-[15px]" : "left-[15px]";
  const isRTL = locale === "ar";
  const labelDir = isRTL ? "right-[15px]" : "left-[15px]";

  return (
    <div className="relative">
      <div className="flex w-full items-center gap-1">
        {isPdf && (
          <img src={pdfImg.src} width={"25px"} height={"25px"} alt="pdf file" />
        )}
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
      {/* date */}
      {isDate && (
        <span
          className={`absolute top-[8px] ${
            isRTL ? "left-[50px]" : "right-[50px]"
          }`}
        >
          <CalendarRangeIcon />
        </span>
      )}
      {/* select icon */}
      {isSelect && (
        <span
          className={`absolute top-[8px] ${
            isRTL ? "left-[50px]" : "right-[50px]"
          }`}
        >
          <ChevronDownIcon />
        </span>
      )}
      {/* validation icon */}
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
