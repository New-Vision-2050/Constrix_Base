"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Form } from "@/modules/table/components/ui/form";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  createLegalDataFormSchema,
  LegalDataFormValues,
} from "./schema/set-legal-schema";
import LegalDataRow from "./components/LegalDataRow";
import { useQuery } from "@tanstack/react-query";
import { baseURL } from "@/config/axios-config";
import axios from "axios";

interface SetLegalDataFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: LegalDataFormValues;
  mode?: "add" | "edit";
}

export default function SetLegalDataForm({
  onSuccess,
  onCancel,
  initialData,
  mode = "add",
}: SetLegalDataFormProps) {
  const t = useTranslations("companyProfileLegalDataForm");

  // Fetch registration types
  const { data: registrationTypesData } = useQuery({
    queryKey: ["company-registration-types"],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/company_registration_types`);
      return response.data;
    },
  });

  const form = useForm<LegalDataFormValues>({
    resolver: zodResolver(createLegalDataFormSchema(t)),
    mode: "onChange",
    defaultValues: initialData || {
      data: [
        {
          registration_type_id: "",
          registration_type_type: "",
          registration_number: "",
          start_date: "",
          end_date: "",
          files: [],
        },
      ],
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "data",
  });

  // Show toast for validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(firstError.message as string);
      }
    }
  }, [errors]);

  const onSubmit = async (data: LegalDataFormValues) => {
    try {
      console.log("Form data:", data);
      toast.success(t("save"));
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("حدث خطأ أثناء الحفظ");
    }
  };

  const handleAddRecord = () => {
    if (fields.length >= 10) {
      toast.error(t("maxRecordsReached"));
      return;
    }
    append({
      registration_type_id: "",
      registration_type_type: "",
      registration_number: "",
      start_date: "",
      end_date: "",
      files: [],
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Legal Data Rows */}
        {fields.map((field, index) => (
          <LegalDataRow
            key={field.id}
            control={control}
            watch={watch}
            index={index}
            onDelete={() => remove(index)}
            canDelete={fields.length > 1}
            t={t}
            registrationTypes={registrationTypesData?.payload || []}
            isSubmitting={isSubmitting}
          />
        ))}

        {/* Add New Record Button */}
        {fields.length < 10 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleAddRecord}
            disabled={isSubmitting}
            className="w-full border-dashed border-2 border-primary text-primary hover:bg-primary/10"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("addNewRecord")}
          </Button>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("save")}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              {t("cancel")}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
