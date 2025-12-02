import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { TextField, MenuItem, Chip, Box, Stack } from "@mui/material";

interface SelectOption {
  value: string;
  label: string;
}

interface FormMultiSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Reusable MUI TextField with multi-select support and react-hook-form integration
 * RTL/LTR handled automatically by MUI
 * Supports Light/Dark mode through MUI theme
 */
export default function FormMultiSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  disabled = false,
  required = false,
}: FormMultiSelectProps<T>) {
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
            multiple: true,
            displayEmpty: Boolean(placeholder),
            renderValue: (selected) => {
              const selectedArray = selected as string[];
              if (selectedArray.length === 0) {
                return <span style={{ opacity: 0.5 }}>{placeholder}</span>;
              }
              return (
                <Stack direction="row" flexWrap="wrap" gap={0.5}>
                  {selectedArray.map((value) => {
                    const option = options.find((opt) => opt.value === value);
                    return (
                      <Chip
                        key={value}
                        label={option?.label || value}
                        size="small"
                      />
                    );
                  })}
                </Stack>
              );
            },
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

