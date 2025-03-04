import { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const COUNTRY_CODES = [
  { label: "+963 🇸🇾", value: "+963" },
  { label: "+964 🇮🇶", value: "+964" },
  { label: "+966 🇸🇦", value: "+966" },
] as const;

type PhoneInputProps = {
  name: string;
};

export default function PhoneInput({ name }: PhoneInputProps) {
  const [selectedCode, setSelectedCode] = useState<string>(
    COUNTRY_CODES[0].value
  );

  const handleChange = useCallback((str: string) => {
    setSelectedCode(str);
  }, []);

  return (
    <div className="flex gap-2 items-center justify-between">
      <PhoneCountrySelect selectedCode={selectedCode} onChange={handleChange} />
      <PhoneNumberInput name={name} />
    </div>
  );
}

/** Country Code Select Component */
function PhoneCountrySelect({
  selectedCode,
  onChange,
}: {
  selectedCode: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select onValueChange={onChange} defaultValue={selectedCode}>
      <SelectTrigger className="w-28 border rounded-md px-3 py-2">
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
  );
}

/** Phone Number Input Component */
function PhoneNumberInput({ name }: { name: string }) {
  const { register } = useFormContext();
  return (
    <div className="w-full">
      <Input
        label="phone"
        type="text"
        variant="secondary"
        placeholder="Enter phone number"
        {...register(name)}
      />
    </div>
  );
}
