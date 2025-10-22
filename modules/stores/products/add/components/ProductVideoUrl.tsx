"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/modules/table/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
} from "@/modules/table/components/ui/form";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { useTranslations } from "next-intl";

interface ProductVideoUrlProps {
  form: UseFormReturn<any>;
}

export default function ProductVideoUrl({ form }: ProductVideoUrlProps) {
  const t = useTranslations("product");
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="video_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("fields.productVideo")}</FormLabel>
            <FormControl>
              <Input {...field} type="url" placeholder={t("placeholders.videoUrl")} />
            </FormControl>
            <FormErrorMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
