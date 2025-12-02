import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { TextField, MenuItem } from "@mui/material";

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
 * Reusable MUI TextField with select prop and react-hook-form integration
 * RTL/LTR handled automatically by MUI
 * Supports Light/Dark mode through MUI theme
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
        <TextField
          {...field}
          select
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          fullWidth
          size="small"
          error={!!error}
          helperText={error?.message}
          SelectProps={{
            displayEmpty: Boolean(placeholder),
          }}
        >
          {placeholder && (
            <MenuItem value="" disabled>
              {placeholder}
            </MenuItem>
          )}
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
