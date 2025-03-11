import { SetStateAction, useCallback, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InputField from "./InputField";
import { Asterisk } from "lucide-react";

const COUNTRY_CODES = [
  { label: "+963 🇸🇾", value: "+963" },
  { label: "+964 🇮🇶", value: "+964" },
  { label: "+966 🇸🇦", value: "+966" },
] as const;

type PhoneInputProps = {
  name: string;
  errMsg?: string;
  required?: boolean;
  setCountryCode: React.Dispatch<SetStateAction<string>>;
};

export default function PhoneInput({
  name,
  required,
  errMsg,
  setCountryCode,
}: PhoneInputProps) {
  const [selectedCode, setSelectedCode] = useState<string>(
    COUNTRY_CODES[0].value
  );

  const handleChange = useCallback((str: string) => {
    setSelectedCode(str);
    setCountryCode(str);
  }, []);

  return (
    <div className="flex gap-2 items-end justify-between">
      <PhoneCountrySelect
        errMsg={errMsg}
        selectedCode={selectedCode}
        onChange={handleChange}
        required={required}
      />
      <PhoneNumberInput name={name} errMsg={errMsg} />
    </div>
  );
}

/** Country Code Select Component */
function PhoneCountrySelect({
  selectedCode,
  onChange,
  required,
  errMsg,
}: {
  errMsg?: string;
  required?: boolean;
  selectedCode: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col my-2">
      <label className="flex items-center gap-1 text-lg font-medium text-[#E7E3FC61]">
        الدولة
        {required && <Asterisk className="text-red-500 w-[12px]" />}
      </label>
      <Select onValueChange={onChange} defaultValue={selectedCode}>
        <SelectTrigger className="w-28 h-[56px] border rounded-md px-3 py-2">
          <SelectValue placeholder="Code" />
        </SelectTrigger>
        <SelectContent>
          {COUNTRY_CODES.map((code) => (
            <SelectItem key={code.value} value={code.value}>
              {code.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {Boolean(errMsg) && <p className="text-sm text-red-500 my-1">.</p>}
    </div>
  );
}

/** Phone Number Input Component */
function PhoneNumberInput({ name, errMsg }: { name: string; errMsg?: string }) {
  return (
    <div className="w-full">
      <InputField
        required={true}
        fieldName={name}
        label="رقم الجوال"
        placeholder="رقم الجوال"
        errMsg={errMsg}
      />
    </div>
  );
}
