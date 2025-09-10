"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Input } from "@/modules/table/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
} from "@/modules/table/components/ui/form";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import type { CreateProductFormData } from "../schema";

interface ProductBasicInfoProps {
  form: UseFormReturn<CreateProductFormData>;
}

export default function ProductBasicInfo({ form }: ProductBasicInfoProps) {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label className="text-gray-400 text-sm mb-2 block">
                {t("product.dialog.add.fields.name.label")}
              </Label>
              <FormControl>
                <Input
                  placeholder={t("product.dialog.add.fields.name.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <Label className="text-gray-400 text-sm mb-2 block">
                {t("product.dialog.add.fields.price.label")}
              </Label>
              <FormControl>
                <Input
                  placeholder={t("product.dialog.add.fields.price.placeholder")}
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <Label className="text-gray-400 text-sm mb-2 block">
                {t("product.dialog.add.fields.sku.label")}
              </Label>
              <FormControl>
                <Input
                  placeholder={t("product.dialog.add.fields.sku.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <Label className="text-gray-400 text-sm mb-2 block">
                {t("product.dialog.add.fields.description.label")}
              </Label>
              <FormControl>
                <Input
                  placeholder={t(
                    "product.dialog.add.fields.description.placeholder"
                  )}
                  {...field}
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
