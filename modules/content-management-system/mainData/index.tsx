"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Form } from "@/modules/table/components/ui/form";
import { toast } from "sonner";
import {
  createMainDataFormSchema,
  getDefaultMainDataFormValues,
  MainDataFormData,
} from "./schemas/main-data-form.schema";
import BasicDataSection from "./components/BasicDataSection";
import AppearanceSection from "./components/AppearanceSection";

export default function ContentManagementSystemMainData() {
  const t = useTranslations("content-management-system.mainData");
  const [isSaving, setIsSaving] = useState(false);

  const mainDataSchema = createMainDataFormSchema(t);
  const form = useForm<MainDataFormData>({
    resolver: zodResolver(mainDataSchema),
    defaultValues: getDefaultMainDataFormValues(),
  });

  const onSubmit = async (data: MainDataFormData) => {
    setIsSaving(true);
    try {
      // TODO: Implement save logic with API call
      console.log("Form data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(t("saveSuccess") || "تم الحفظ بنجاح");
    } catch {
      toast.error(t("saveError") || "فشل الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BasicDataSection form={form} />
          <AppearanceSection form={form} isSaving={isSaving} />
        </form>
      </Form>
    </div>
  );
}
