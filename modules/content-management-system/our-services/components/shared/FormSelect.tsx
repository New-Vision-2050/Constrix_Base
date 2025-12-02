import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Reusable MUI Select with react-hook-form integration
 * RTL/LTR handled automatically by MUI
 */
export default function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  disabled = false,
  required = false,
}: FormSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error} size="small" required={required}>
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            label={label}
            disabled={disabled}
            displayEmpty
            className="w-full bg-sidebar"
          >
            {placeholder && <MenuItem value="" disabled>{placeholder}</MenuItem>}
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
