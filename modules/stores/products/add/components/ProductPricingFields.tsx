"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/modules/table/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormControl,
} from "@/modules/table/components/ui/form";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import FormLabel from "@/components/shared/FormLabel";

interface ProductPricingFieldsProps {
  form: UseFormReturn<any>;
}

export default function ProductPricingFields({
  form,
}: ProductPricingFieldsProps) {
  return (
    <div className="space-y-6">
      {/* First Row: السعر - الحد الادنى - كمية المخزون */}
      <div className="grid grid-cols-3 gap-6">
        {/* السعر */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>السعر الوحدة ($)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="320"
                  className="h-12"
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        {/* الحد الادنى لكمية الطلب */}
        <FormField
          control={form.control}
          name="min_order_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>الحد الادنى لكمية الطلب</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="1"
                  className="h-12"
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        {/* كمية المخزون الحالية */}
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>كمية المخزون الحالية</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="0"
                  className="h-12"
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Second Row: نوع الحجم - مبلغ الحجم - مبلغ الضريبة */}
      <div className="grid grid-cols-3 gap-6">
        {/* نوع الحجم */}
        <FormField
          control={form.control}
          name="discount_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>نوع الخصم</FormLabel>
              <Select key={field.value} onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="اختر نوع الخصم" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="flat">مستوى</SelectItem>
                  <SelectItem value="percentage">نسبة مئوية</SelectItem>
                </SelectContent>
              </Select>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        {/* مبلغ الحجم ($) */}
        <FormField
          control={form.control}
          name="discount_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>مبلغ الخصم ($)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="0"
                  className="h-12"
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        {/* مبلغ الضريبة (%) */}
        <FormField
          control={form.control}
          name="vat_percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>مبلغ الضريبة (%)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="0"
                  className="h-12"
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Third Row: حساب الضريبة - تكلفة الشحن - حساب تكلفة الشحن */}
      <div className="grid grid-cols-3 gap-6">
        {/* حساب الضريبة */}
        <FormField
          control={form.control}
          name="price_includes_vat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>حساب تكلفة الشحن ($)</FormLabel>
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

        {/* تكلفة الشحن ($) */}
        <FormField
          control={form.control}
          name="shipping_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تكلفة الشحن ($)</FormLabel>
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

        {/* حساب تكلفة الشحن ($) */}
        <FormField
          control={form.control}
          name="shipping_included_in_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>حساب تكلفة الشحن ($)</FormLabel>
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
  );
}
