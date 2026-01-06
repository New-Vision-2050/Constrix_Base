'use client';

import React from "react";
import { Control, UseFormWatch } from "react-hook-form";
import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { FormField, FormItem, FormControl } from "@/modules/table/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import CustomDateField from "@/components/shared/CustomDateField";
import FileUploadButton from "@/components/shared/FileUploadButton";
import { LegalDataFormValues } from "../schema/set-legal-schema";
import { RegistrationTypes } from "../../registration-types";

interface LegalDataRowProps {
  control: Control<LegalDataFormValues>;
  watch: UseFormWatch<LegalDataFormValues>;
  index: number;
  onDelete: () => void;
  canDelete: boolean;
  t: (key: string) => string;
  registrationTypes: Array<{ id: string; name: string; type: string }>;
  isSubmitting: boolean;
}

export default function LegalDataRow({
  control,
  watch,
  index,
  onDelete,
  canDelete,
  t,
  registrationTypes,
  isSubmitting,
}: LegalDataRowProps) {
  // Watch registration type to conditionally show registration number field
  const registrationType = watch(`data.${index}.registration_type_type`);
  const showRegistrationNumber = registrationType !== RegistrationTypes.WithoutARegister;

  return (
    <div className="p-4 bg-sidebar rounded-lg border border-sidebar-border relative mb-4">
      {/* Delete button */}
      {canDelete && (
        <IconButton
          onClick={onDelete}
          disabled={isSubmitting}
          className="absolute top-2 left-2"
          color="error"
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Registration Type */}
        <div className={showRegistrationNumber ? "" : "md:col-span-2"}>
        <FormField
          control={control}
          name={`data.${index}.registration_type_id`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs" required>
                {t("registrationType")}
              </FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="mt-1 bg-sidebar border-white text-white h-12">
                    <SelectValue placeholder={t("registrationTypePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {registrationTypes?.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />
        </div>

        {/* Registration Number - Conditional */}
        {showRegistrationNumber && (
          <div>
          <FormField
            control={control}
            name={`data.${index}.registration_number`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs" required>
                  {t("registrationNumber")}
                </FormLabel>
                <FormControl>
                  <Input
                    variant="secondary"
                    disabled={isSubmitting}
                    className="mt-1"
                    placeholder={t("registrationNumberPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            )}
          />
          </div>
        )}

        {/* Start Date */}
        <FormField
          control={control}
          name={`data.${index}.start_date`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs" required>
                {t("startDate")}
              </FormLabel>
              <FormControl>
                <CustomDateField
                  name={field.name}
                  disabled={isSubmitting}
                  placeholder={t("startDatePlaceholder")}
                  selectedDate={field.value ? new Date(field.value) : undefined}
                  setSelectedDate={(value) => {
                    const newDate = typeof value === 'function' ? value(field.value ? new Date(field.value) : undefined) : value;
                    field.onChange(newDate ? newDate.toISOString() : undefined);
                  }}
                  className="mt-1 bg-sidebar border-white text-white"
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        {/* End Date */}
        <FormField
          control={control}
          name={`data.${index}.end_date`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs" required>
                {t("endDate")}
              </FormLabel>
              <FormControl>
                <CustomDateField
                  name={field.name}
                  disabled={isSubmitting}
                  placeholder={t("endDatePlaceholder")}
                  selectedDate={field.value ? new Date(field.value) : undefined}
                  setSelectedDate={(value) => {
                    const newDate = typeof value === 'function' ? value(field.value ? new Date(field.value) : undefined) : value;
                    field.onChange(newDate ? newDate.toISOString() : undefined);
                  }}
                  className="mt-1 bg-sidebar border-white text-white"
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        {/* File Upload */}
        <FormField
          control={control}
          name={`data.${index}.files`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs" required>
                {t("attachFile")}
              </FormLabel>
              <FormControl>
                <FileUploadButton
                  onChange={(file) => field.onChange(file ? [file] : [])}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  maxSize="5MB"
                  disabled={isSubmitting}
                  label={t("attachFile")}
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
