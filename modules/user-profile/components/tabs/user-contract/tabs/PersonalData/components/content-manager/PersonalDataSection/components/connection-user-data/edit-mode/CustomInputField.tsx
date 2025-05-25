import React, { useState } from "react";
import { useLocale } from "next-intl";
import { Asterisk } from "lucide-react";
import { Input } from "@/modules/table/components/ui/input";
import CountryCodeSelect from "./CountriesCodesSelect";
import { isValidEmail } from "@/utils/valid-email";
import libphonenumbers from "libphonenumbers";

type PropsT = {
  value: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  type: "email" | "phone";
  onChange: (str: string) => void;
  error?: string;
  setError?: React.Dispatch<React.SetStateAction<string>>;
  setPhoneCode?: React.Dispatch<React.SetStateAction<string>>;
};

const CustomInputField = ({
  label,
  value,
  type,
  disabled,
  required,
  onChange,
  error,
  setError,
  setPhoneCode,
}: PropsT) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [code, setCode] = useState("+966");
  const labelDir = isRTL ? "right-[15px]" : "left-[15px]";

  const handleChange = (str: string) => {
    let valid = true;
    if (type === "phone") {
      const phoneUtil = libphonenumbers.PhoneNumberUtil.getInstance();
      const message = "رقم الجوال غير صحيح";

      try {
        const number = phoneUtil.parseAndKeepRawInput(`${code} ${str}`);

        if (!phoneUtil.isValidNumber(number)) {
          setError?.(message);
        } else {
          setError?.("");
        }
      } catch (error) {
        console.log("Error :: ", error);
        setError?.(message);
      }
      const cleanedStr = str.replace(/[^\d]/g, "");

      onChange(cleanedStr);
    } else if (type === "email") {
      valid = isValidEmail(str);
      if (!valid) setError?.("invalid email");
      else setError?.("");

      onChange(str);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col">
        <div className="flex w-full items-end gap-1 mt-2">
          <Input
            type="text"
            className={`${
              Boolean(error) ? "text-red-600" : ""
            } focus-visible:ring-0`}
            value={value}
            disabled={disabled}
            onChange={(e) => handleChange(e.target.value)}
          />
          {type === "phone" && (
            <CountryCodeSelect
              value={code}
              onChange={(str) => {
                setPhoneCode?.(str);
                setCode(str);
              }}
            />
          )}
        </div>
        {error && (
          <small className="text-red-500 absolute bottom-[-16px] text-[12px]">
            {error}
          </small>
        )}
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
