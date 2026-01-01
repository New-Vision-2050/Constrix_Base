import React, { useState, useEffect, useMemo } from "react";
import { FieldConfig, ValidationRule } from "../../types/formTypes";
import { cn } from "@/lib/utils";
import { Input } from "@/modules/table/components/ui/input";
import { Button } from "@/modules/table/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/table/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/modules/table/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";

// Country codes for phone numbers with flags
const countryCodesData = [
  { value: "+20", label: "Egypt (+20)", flag: "🇪🇬", code: "+20" },
  { value: "+966", label: "Saudi Arabia (+966)", flag: "🇸🇦", code: "+966" },
  { value: "+971", label: "UAE (+971)", flag: "🇦🇪", code: "+971" },
  { value: "+65", label: "Singapore (+65)", flag: "🇸🇬", code: "+65" },
  { value: "+82", label: "South Korea (+82)", flag: "🇰🇷", code: "+82" },
  { value: "+34", label: "Spain (+34)", flag: "🇪🇸", code: "+34" },
  { value: "+52", label: "Mexico (+52)", flag: "🇲🇽", code: "+52" },
  { value: "+31", label: "Netherlands (+31)", flag: "🇳🇱", code: "+31" },
  { value: "+90", label: "Turkey (+90)", flag: "🇹🇷", code: "+90" },
  { value: "+1", label: "United States (+1)", flag: "🇺🇸", code: "+1" },
  { value: "+44", label: "United Kingdom (+44)", flag: "🇬🇧", code: "+44" },
  { value: "+91", label: "India (+91)", flag: "🇮🇳", code: "+91" },
  { value: "+86", label: "China (+86)", flag: "🇨🇳", code: "+86" },
  { value: "+49", label: "Germany (+49)", flag: "🇩🇪", code: "+49" },
  { value: "+33", label: "France (+33)", flag: "🇫🇷", code: "+33" },
  { value: "+81", label: "Japan (+81)", flag: "🇯🇵", code: "+81" },
  { value: "+39", label: "Italy (+39)", flag: "🇮🇹", code: "+39" },
  { value: "+7", label: "Russia (+7)", flag: "🇷🇺", code: "+7" },
  { value: "+55", label: "Brazil (+55)", flag: "🇧🇷", code: "+55" },
  { value: "+61", label: "Australia (+61)", flag: "🇦🇺", code: "+61" },
];

interface PhoneFieldProps {
  field: FieldConfig;
  value: string;
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

const PhoneField: React.FC<PhoneFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
}) => {
  const t = useTranslations("FormBuilder.Fields.Phone");

  // Country codes with translated labels
  const countryCodes = useMemo(
    () =>
      countryCodesData.map((country) => ({
        ...country,
        label:
          t(`Countries.${country.value.replace("+", "")}`) +
          ` (${country.code})`,
      })),
    [t]
  );

  // Parse the value into country code and phone number
  const [countryCode, setCountryCode] = useState("+966");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [open, setOpen] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  // Phone validation function
  const validatePhone = (phone: string): boolean => {
    // Accept any format that has digits, possibly with a + prefix
    // This allows formats like: +966 542138116, 966542138116, +1-555-123-4567, etc.
    const phoneRegex = /^(\+?\d[\d\s-]{6,})$/;
    return phoneRegex.test(phone.trim());
  };

  // Find the selected country code object
  const selectedCountry = useMemo(() => {
    return (
      countryCodes.find((country) => country.value === countryCode) ||
      countryCodes[0]
    );
  }, [countryCode]);

  // Parse value whenever it changes (for initial values and edit mode)
  useEffect(() => {
    if (value) {
      // Handle different phone number formats
      let code = "+966"; // Default country code
      let number = "";

      // Clean the value by removing any extra spaces
      const cleanValue = value.trim();

      // Case 1: Value starts with + (e.g., +966542138116 or +966 542138116)
      if (cleanValue.startsWith("+")) {
        // Try to extract country code and phone number
        const match = cleanValue.match(/^(\+\d+)[\s-]?(.*)$/);
        if (match) {
          const [, extractedCode, extractedNumber] = match;

          // Find if this is a valid country code in our list
          const foundCountry = countryCodes.find(
            (country) =>
              extractedCode === country.value ||
              country.value.startsWith(extractedCode)
          );

          if (foundCountry) {
            code = foundCountry.value;
            number = extractedNumber || "";
          } else {
            // If no matching country code found, try to extract based on common lengths
            // Most country codes are 1-4 digits
            for (let i = 1; i <= 4; i++) {
              const potentialCode = extractedCode.substring(0, i + 1); // +1, +2, +3, +4 digits
              const foundCountry = countryCodes.find(
                (country) => country.value === potentialCode
              );
              if (foundCountry) {
                code = foundCountry.value;
                number = cleanValue.substring(i + 1); // +1 for the + character
                break;
              }
            }

            // If still no match, use the default and put everything in the number
            if (code === "+966" && !number) {
              number = cleanValue.substring(1); // Remove the + and use as number
            }
          }
        } else {
          // Just a + with no digits after it
          number = "";
        }
      }
      // Case 2: Value doesn't start with + (e.g., 966542138116)
      else {
        // Try to match the beginning with a country code (without +)
        let matched = false;

        // Sort country codes by length (descending) to match longer codes first
        const sortedCodes = [...countryCodes].sort(
          (a, b) => b.value.length - a.value.length
        );

        for (const country of sortedCodes) {
          const codeWithoutPlus = country.value.substring(1); // Remove the +
          if (cleanValue.startsWith(codeWithoutPlus)) {
            code = country.value;
            number = cleanValue.substring(codeWithoutPlus.length);
            matched = true;
            break;
          }
        }

        // If no country code matched, use the default and put everything in the number
        if (!matched) {
          number = cleanValue;
        }
      }

      // Special case for numbers like 966542138116 (Saudi Arabia)
      if (cleanValue.startsWith("966") && cleanValue.length > 9) {
        code = "+966";
        number = cleanValue.substring(3);

        // Don't trigger onChange to avoid infinite loop
        setCountryCode(code);
        setPhoneNumber(number);
        return;
      }

      setCountryCode(code);
      setPhoneNumber(number);
    }
  }, [value]); // Add value to dependency array so it runs when value changes

  // Combine country code and phone number when either changes
  const handleCountryCodeChange = (code: string) => {
    setCountryCode(code);
    const combinedValue = `${code} ${phoneNumber}`.trim();

    // Validate the combined value
    if (phoneNumber && !validatePhone(combinedValue)) {
      setLocalError(t("InvalidPhoneNumber"));
    } else {
      setLocalError(undefined);
    }

    onChange(combinedValue);
    setOpen(false);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;

    // Allow only digits, spaces, and hyphens in the phone number field
    const sanitizedPhoneNumber = newPhoneNumber.replace(/[^\d\s-]/g, "");

    setPhoneNumber(sanitizedPhoneNumber);
    const combinedValue = `${countryCode} ${sanitizedPhoneNumber}`.trim();

    // Validate the combined value
    if (sanitizedPhoneNumber && !validatePhone(combinedValue)) {
      setLocalError(t("InvalidPhoneNumber"));
    } else {
      setLocalError(undefined);
    }

    onChange(combinedValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-grow">
          <Input
            id={`phone-${field.name}`}
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            onBlur={onBlur}
            placeholder={field.placeholder || t("EnterPhoneNumber")}
            className={cn("w-full", !!error && touched ? "border-red-500" : "")}
            disabled={field.disabled}
            required={field.required}
          />
        </div>

        <div className="w-[120px] flex-shrink-0">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between bg-sidebar"
                dir="ltr" // Force left-to-right direction
              >
                <div className="flex items-center">
                  <span className="mr-1">{selectedCountry.flag}</span>
                  <span dir="ltr">{selectedCountry.code}</span>
                </div>
                <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder={t("SearchCountry")} />
                <CommandList>
                  <CommandEmpty>{t("NoCountryFound")}</CommandEmpty>
                  <CommandGroup>
                    {countryCodes.map((country) => (
                      <CommandItem
                        key={country.value}
                        value={country.value}
                        onSelect={() => handleCountryCodeChange(country.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            countryCode === country.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {/* <span className="mr-2">{country.flag}</span> */}
                        <span>{country.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Show either the form validation error or our local validation error */}
      {((error && touched) || localError) && (
        <div className="text-red-500 text-sm mt-1">
          {typeof error === "string" ? error || localError : error}
        </div>
      )}

      {/* Only show helper text if there's no error */}
      {field.helperText && !error && !localError && (
        <p className="text-gray-500 text-sm mt-1">{field.helperText}</p>
      )}
    </div>
  );
};

export default PhoneField;
