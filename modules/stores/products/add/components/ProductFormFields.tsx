"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/modules/table/components/ui/input";
import { Textarea } from "@/modules/table/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  FormField,
  FormItem,
  FormControl,
} from "@/modules/table/components/ui/form";
import FormErrorMessage from "@/components/shared/FormErrorMessage";

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
        name="name"
        render={({ field }) => (
          <FormItem>
            <Label className="text-gray-400 text-sm mb-2 block">
              اسم المنتج
            </Label>
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
        name="description"
        render={({ field }) => (
          <FormItem>
            <Label className="text-gray-400 text-sm mb-2 block">
              وصف المنتج
            </Label>
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
          {/* Serial Number */}
          <FormField
            control={form.control}
            name="serial_number"
            render={({ field }) => (
              <FormItem>
                <Label className="text-gray-400 text-sm mb-2 block">
                  الرقم السري (السيريال)
                </Label>
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
            name="is_available"
            render={({ field }) => (
              <FormItem>
                <Label className="text-gray-400 text-sm mb-2 block">
                  توفر المنتج
                </Label>
                <FormControl>
                  <div className="flex items-center h-10">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
}
