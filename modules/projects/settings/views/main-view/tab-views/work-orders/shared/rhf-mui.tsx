"use client";

import type { ReactNode } from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  TextField,
  type TextFieldProps,
  FormControl,
  InputLabel,
  Select,
  type SelectProps,
  FormHelperText,
} from "@mui/material";

type RhfTextFieldProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
} & Omit<TextFieldProps, "name" | "value" | "onChange" | "onBlur" | "error" | "helperText">;

export function RhfTextField<T extends FieldValues>({
  name,
  control,
  ...textFieldProps
}: RhfTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...textFieldProps}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
}

type RhfSelectProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  disabled?: boolean;
  children: ReactNode;
} & Omit<SelectProps, "name" | "value" | "onChange" | "onBlur" | "label" | "error">;

export function RhfSelect<T extends FieldValues>({
  name,
  control,
  label,
  disabled,
  children,
  ...selectProps
}: RhfSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl
          fullWidth
          error={!!fieldState.error}
          disabled={disabled}
        >
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            {...selectProps}
            label={label}
            value={field.value ?? ""}
          >
            {children}
          </Select>
          {fieldState.error?.message ? (
            <FormHelperText>{fieldState.error.message}</FormHelperText>
          ) : null}
        </FormControl>
      )}
    />
  );
}
