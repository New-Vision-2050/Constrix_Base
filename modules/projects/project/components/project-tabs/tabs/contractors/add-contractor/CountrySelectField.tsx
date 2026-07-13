"use client";

import { Autocomplete, TextField } from "@mui/material";
import type { API_Country } from "@/types/api/shared/country";
import { isSameCountry } from "@/modules/projects/project/query/useCountries";

interface CountrySelectFieldProps {
  label?: string;
  placeholder?: string;
  value: API_Country | null;
  onChange: (value: API_Country | null) => void;
  countries: API_Country[];
  loading?: boolean;
  required?: boolean;
  size?: "small" | "medium";
}

export default function CountrySelectField({
  label,
  placeholder,
  value,
  onChange,
  countries,
  loading = false,
  required = false,
  size = "medium",
}: CountrySelectFieldProps) {
  return (
    <Autocomplete
      loading={loading}
      options={countries}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={isSameCountry}
      value={value}
      onChange={(_, nextValue) => onChange(nextValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          size={size}
        />
      )}
    />
  );
}
