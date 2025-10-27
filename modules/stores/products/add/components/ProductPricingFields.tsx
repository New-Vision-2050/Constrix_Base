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
import { useTranslations } from "next-intl";

interface ProductPricingFieldsProps {
  form: UseFormReturn<any>;
}

export default function ProductPricingFields({
  form,
}: ProductPricingFieldsProps) {
  const t = useTranslations("product");

  // Watch discount_type to dynamically change the label
  const discountType = form.watch("discount_type");

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
              <FormLabel required>{t("fields.unitPrice")}</FormLabel>
              <FormControl>
                <Input {...field} type="number" className="h-12" />
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
              <FormLabel required>{t("fields.minOrderQuantity")}</FormLabel>
              <FormControl>
                <Input {...field} type="number" className="h-12" />
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
              <FormLabel>{t("fields.currentStock")}</FormLabel>
              <FormControl>
                <Input {...field} type="number" className="h-12" />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Second Row: نوع الخصم- مبلغ الخصم - مبلغ الضريبة */}
      <div className="grid grid-cols-3 gap-6">
        {/* نوع الخصم*/}
        <FormField
          control={form.control}
          name="discount_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{t("fields.discountType")}</FormLabel>
              <Select
                key={field.value}
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue
                      placeholder={t("placeholders.selectDiscountType")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="amount">{t("options.amount")}</SelectItem>
                  <SelectItem value="percentage">
                    {t("options.percentage")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        {/* مبلغ الخصم - Dynamic label based on discount type */}
        <FormField
          control={form.control}
          name="discount_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {discountType === "amount"
                  ? `${t("fields.discountAmount")} (SAR)`
                  : discountType === "percentage"
                  ? `${t("fields.discountAmount")} (%)`
                  : t("fields.discountAmount")}
              </FormLabel>
              <FormControl>
                <Input {...field} type="number" className="h-12" />
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
              <FormLabel>{t("fields.taxAmount")}</FormLabel>
              <FormControl>
                <Input {...field} type="number" className="h-12" />
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
              <FormLabel>{t("fields.priceIncludesVat")}</FormLabel>
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

        {/* تكلفة الشحن */}
        <FormField
          control={form.control}
          name="shipping_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.shippingCost")}</FormLabel>
              <FormControl>
                <Input {...field} type="number" className="h-12" />
              </FormControl>
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
              <FormLabel>{t("fields.calculateShippingCost")}</FormLabel>
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
