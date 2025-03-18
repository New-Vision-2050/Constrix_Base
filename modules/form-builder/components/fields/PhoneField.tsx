import React, { useState, useEffect, useMemo } from 'react';
import { FieldConfig, ValidationRule } from '../../types/formTypes';
import { cn } from '@/lib/utils';
import { Input } from '@/modules/table/components/ui/input';
import { Button } from '@/modules/table/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/table/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/modules/table/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';

// Country codes for phone numbers with flags
const countryCodes = [
  { value: '+20', label: 'Egypt (+20)', flag: '🇪🇬', code: '+20' },
  { value: '+966', label: 'Saudi Arabia (+966)', flag: '🇸🇦', code: '+966' },
  { value: '+971', label: 'UAE (+971)', flag: '🇦🇪', code: '+971' },
  { value: '+65', label: 'Singapore (+65)', flag: '🇸🇬', code: '+65' },
  { value: '+82', label: 'South Korea (+82)', flag: '🇰🇷', code: '+82' },
  { value: '+34', label: 'Spain (+34)', flag: '🇪🇸', code: '+34' },
  { value: '+52', label: 'Mexico (+52)', flag: '🇲🇽', code: '+52' },
  { value: '+31', label: 'Netherlands (+31)', flag: '🇳🇱', code: '+31' },
  { value: '+90', label: 'Turkey (+90)', flag: '🇹🇷', code: '+90' },
  { value: '+1', label: 'United States (+1)', flag: '🇺🇸', code: '+1' },
  { value: '+44', label: 'United Kingdom (+44)', flag: '🇬🇧', code: '+44' },
  { value: '+91', label: 'India (+91)', flag: '🇮🇳', code: '+91' },
  { value: '+86', label: 'China (+86)', flag: '🇨🇳', code: '+86' },
  { value: '+49', label: 'Germany (+49)', flag: '🇩🇪', code: '+49' },
  { value: '+33', label: 'France (+33)', flag: '🇫🇷', code: '+33' },
  { value: '+81', label: 'Japan (+81)', flag: '🇯🇵', code: '+81' },
  { value: '+39', label: 'Italy (+39)', flag: '🇮🇹', code: '+39' },
  { value: '+7', label: 'Russia (+7)', flag: '🇷🇺', code: '+7' },
  { value: '+55', label: 'Brazil (+55)', flag: '🇧🇷', code: '+55' },
  { value: '+61', label: 'Australia (+61)', flag: '🇦🇺', code: '+61' },
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
  // Parse the value into country code and phone number
  const [countryCode, setCountryCode] = useState('+966');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [open, setOpen] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  // Phone validation function
  const validatePhone = (phone: string): boolean => {
      return true; //TODO To Be enhanced
    // Basic phone validation - can be enhanced as needed
    const phoneRegex = /^\d{6,14}\s\+\d{1,4}$/;
    return phoneRegex.test(phone);
  };

  // Find the selected country code object
  const selectedCountry = useMemo(() => {
    return countryCodes.find(country => country.value === countryCode) || countryCodes[0];
  }, [countryCode]);

  // Initialize from value
  useEffect(() => {
    if (value) {
      // Try to extract country code from the value (now at the end)
      const match = value.match(/^(.*?)(\+\d+)$/);
      if (match) {
        const [, number, code] = match;
        setCountryCode(code);
        setPhoneNumber(number.trim());
      } else {
        // If no country code is found, just set the phone number
        setPhoneNumber(value);
      }
    }
  }, []);

  // Combine country code and phone number when either changes
  const handleCountryCodeChange = (code: string) => {
    setCountryCode(code);
    const combinedValue = `${code}${phoneNumber}`.trim();

    // Validate the combined value
    if (phoneNumber && !validatePhone(combinedValue)) {
      setLocalError("Please enter a valid phone number");
    } else {
      setLocalError(undefined);
    }

    onChange(combinedValue);
    setOpen(false);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
    const combinedValue = `${countryCode}${newPhoneNumber}`.trim();

    // Validate the combined value
    if (newPhoneNumber && !validatePhone(combinedValue)) {
      setLocalError("Please enter a valid phone number");
    } else {
      setLocalError(undefined);
    }

    onChange(combinedValue);
  };

  return (
    <div className="space-y-2">
      {field.label && (
        <label
          htmlFor={`phone-${field.name}`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex gap-2">
        <div className="flex-grow">
          <Input
            id={`phone-${field.name}`}
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            onBlur={onBlur}
            placeholder={field.placeholder || "Enter phone number"}
            className={cn(
              "w-full",
              !!error && touched ? "border-red-500" : ""
            )}
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
                <CommandInput placeholder="Search country..." />
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
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
                            countryCode === country.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="mr-2">{country.flag}</span>
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
          {typeof error === 'string' ? error || localError : error}
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
