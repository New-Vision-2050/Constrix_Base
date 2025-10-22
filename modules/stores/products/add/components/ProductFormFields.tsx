"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/modules/table/components/ui/input";
import { Textarea } from "@/modules/table/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  FormField,
  FormItem,
  FormControl,
} from "@/modules/table/components/ui/form";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import FormLabel from "@/components/shared/FormLabel";

interface ProductFormFieldsProps {
  form: UseFormReturn<any>;
  language: "ar" | "en";
}

export default function ProductFormFields({
  form,
  language,
}: ProductFormFieldsProps) {
  return (
    <>
      {/* Product Name */}
      <FormField
        control={form.control}
        name={language === "ar" ? "name_ar" : "name_en"}
        render={({ field }) => (
          <FormItem>
            <FormLabel required>
              {language === "ar" ? "اسم المنتج" : "Product Name"}
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormErrorMessage />
          </FormItem>
        )}
      />

      {/* Product Description */}
      <FormField
        control={form.control}
        name={language === "ar" ? "description_ar" : "description_en"}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {language === "ar" ? "وصف المنتج" : "Product Description"}
            </FormLabel>
            <FormControl>
              <Textarea {...field} className="bg-sidebar" />
            </FormControl>
            <FormErrorMessage />
          </FormItem>
        )}
      />

      {/* Fields outside tabs */}
      <div className="space-y-6 mt-6">
        {/* Serial Number and Product Type Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* SKU - Product Code */}
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>كود المنتج (السيريال)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            )}
          />

          {/* Product Type Toggle */}
          <FormField
            control={form.control}
            name="is_visible"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الحالة</FormLabel>
                <div className="flex items-center h-12 bg-sidebar border border-border rounded-md px-4">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary"
                    />
                  </FormControl>
                </div>
                <FormErrorMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
}
