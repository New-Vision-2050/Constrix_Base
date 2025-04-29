import { countryCodes } from "@/constants/countries-codes";
import React from "react";

interface CountryCodeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="w-40">
      <div className="relative">
        <select
          id="countryCode"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full appearance-none rounded-md border bg-sidebar py-2 pl-3 pr-10 text-sm leading-6 focus:outline-none focus:ring-2 shadow-sm"
        >
          {countryCodes.map((country) => (
            <option key={country.value} value={country.value}>
              {country.flag} {country.code}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-4 w-4 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CountryCodeSelect;
