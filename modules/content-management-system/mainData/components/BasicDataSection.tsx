"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/modules/table/components/ui/input";
import ImageUpload from "@/components/shared/ImageUpload";
import {
  FormField,
  FormItem,
  FormControl,
} from "@/modules/table/components/ui/form";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { MainDataFormData } from "../schemas/main-data-form.schema";

interface BasicDataSectionProps {
  form: UseFormReturn<MainDataFormData>;
}

export default function BasicDataSection({ form }: BasicDataSectionProps) {
  const t = useTranslations("content-management-system.mainData");

  const handleSiteLogoChange = (file: File | null) => {
    form.setValue("site_logo", file);
  };

  const siteLogoValue = form.watch("site_logo");

  return (
    <div className="backdrop-blur-sm rounded-xl border p-6 space-y-6 shadow-xl">
      <h2 className="text-xl font-semibold text-white mb-6 text-right">
        {t("basicData.title")}
      </h2>

      {/* Site Title and Site Logo - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site Title - Left Side */}
        <FormField
          control={form.control}
          name="site_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right">
                {t("basicData.siteTitle")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder={t("basicData.siteTitlePlaceholder")}
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        {/* Site Logo - Right Side */}
        <div>
          <ImageUpload
            label={t("basicData.siteLogo")}
            maxSize={t("basicData.logoMaxSize")}
            dimensions={t("basicData.logoDimensions")}
            onChange={handleSiteLogoChange}
            initialValue={
              typeof siteLogoValue === "string" ? siteLogoValue : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}

