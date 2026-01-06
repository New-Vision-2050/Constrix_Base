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
import { CompanyProfileLegalDataApi } from "@/services/api/company-profile/legal-data";
import { serialize } from "object-to-formdata";

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
      const response = await CompanyProfileLegalDataApi.getRegistrationTypes();
      return response.data;
    },
  });
  const registrationTypesOptions =
    registrationTypesData?.payload?.map((item) => ({
      id: item.id_type,
      name: item.name,
      type: item.id_type,
    })) || [];

  const form = useForm<LegalDataFormValues>({
    resolver: zodResolver(createLegalDataFormSchema(t)),
    mode: "onChange",
    defaultValues: initialData || {
      data: [],
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

  console.log("errors77errors", errors, initialData);

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
      if (mode === "add") {
        // Create mode: send array of new records
        const payload = data?.data?.map((item) => ({
          registration_type_id: item.registration_type_id?.split("_")?.[0],
          regestration_number: item.registration_number || undefined,
          start_date:
            typeof item.start_date === "string"
              ? item.start_date
              : item.start_date.toISOString(),
          end_date:
            typeof item.end_date === "string"
              ? item.end_date
              : item.end_date.toISOString(),
          files: item.files.filter(
            (file): file is File => file instanceof File
          ),
        }));

        await CompanyProfileLegalDataApi.create(payload);
      } else {
        // Edit mode: send update payload
        console.log("updatedata", data);
        const updatePayload = {
          data: data?.data?.map((item) => {
            const binaryFiles = item.files.filter(
              (file): file is File => file instanceof File
            );
            const backendFiles = item.files.filter(
              (file): file is { url: string } =>
                !(file instanceof File) &&
                typeof file === "object" &&
                "url" in file
            );

            return {
              id: item.id,
              start_date:
                typeof item.start_date === "string"
                  ? item.start_date
                  : item.start_date.toISOString(),
              end_date:
                typeof item.end_date === "string"
                  ? item.end_date
                  : item.end_date.toISOString(),
              file: binaryFiles.length > 0 ? binaryFiles : undefined,
              files: backendFiles.length > 0 ? backendFiles : undefined,
            };
          }),
        };

        await CompanyProfileLegalDataApi.update(updatePayload, {});
      }

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
            canDelete={fields.length > 1 && mode == "add"}
            t={t}
            mode={mode}
            registrationTypes={registrationTypesOptions || []}
            isSubmitting={isSubmitting}
          />
        ))}

        {/* Add New Record Button */}
        {fields.length < 10 && mode == "add" && (
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
