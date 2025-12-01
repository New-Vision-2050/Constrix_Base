import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";

interface FormTextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

/**
 * Reusable MUI TextField wrapper with react-hook-form integration
 * Supports RTL/LTR and light/dark mode automatically
 */
export default function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled = false,
  required = false,
  multiline = false,
  rows,
}: FormTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          placeholder={placeholder}
          error={!!error}
          helperText={error?.message}
          disabled={disabled}
          required={required}
          multiline={multiline}
          rows={rows}
          fullWidth
          variant="outlined"
          size="small"
          sx={{
            "& .MuiInputBase-root": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#1e293b" : "#f8fafc",
            },
          }}
        />
      )}
    />
  );
}

