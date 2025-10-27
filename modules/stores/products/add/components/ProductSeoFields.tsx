"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/modules/table/components/ui/input";
import { Textarea } from "@/modules/table/components/ui/textarea";
import ImageUpload from "@/components/shared/ImageUpload";
import {
  FormField,
  FormItem,
  FormControl,
} from "@/modules/table/components/ui/form";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { useTranslations } from "next-intl";

interface ProductSeoFieldsProps {
  form: UseFormReturn<any>;
}

export default function ProductSeoFields({ form }: ProductSeoFieldsProps) {
  const t = useTranslations("product");

  const handleMetaPhotoChange = (file: File | null) => {
    form.setValue("meta_photo", file);
  };

  // Get initial value for edit mode
  const metaPhotoValue = form.watch("meta_photo");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Meta Title and Description */}
        <div className="col-span-9 space-y-6">
          {/* Meta Title */}
          <FormField
            control={form.control}
            name="meta_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.metaTitle")}</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="" />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            )}
          />

          {/* Meta Description */}
          <FormField
            control={form.control}
            name="meta_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.metaDescription")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder=""
                    className="bg-sidebar min-h-[100px] resize-none"
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            )}
          />

          {/* Meta Keywords */}
          <FormField
            control={form.control}
            name="meta_keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.metaKeywords")}</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="" />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            )}
          />
        </div>
        {/* SEO Image Upload */}
        <div className="col-span-3">
          <ImageUpload
            label={t("fields.metaPhoto")}
            maxSize={t("seo.recommendedSize")}
            dimensions="3 MB × 5 MB"
            required={false}
            onChange={handleMetaPhotoChange}
            initialValue={
              typeof metaPhotoValue === "string" ? metaPhotoValue : undefined
            }
            minHeight="280px"
          />
        </div>
      </div>
    </div>
  );
}
