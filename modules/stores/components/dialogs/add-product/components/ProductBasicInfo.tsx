"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label className="text-gray-400 text-sm mb-2 block">
                اسم المنتج
              </Label>
              <FormControl>
                <Input placeholder="هاتف ايفون" {...field} />
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
                سعر المنتج
              </Label>
              <FormControl>
                <Input placeholder="1600" type="number" {...field} />
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
                رمز المنتج
              </Label>
              <FormControl>
                <Input placeholder="16AAFF206" {...field} />
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
                وصف المنتج
              </Label>
              <FormControl>
                <Input
                  placeholder="وصف هذا المنتج الذي قد يكون سطرا أو يتجاوز ذلك بـ..."
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
