"use client";

import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/modules/table/components/ui/input";
import SimpleSelect from "@/components/headless/select";
import ErrorTypography from "@/components/shared/ErrorTypography";
import type { CreateProductFormData } from "../schema";
import { useQuery } from "@tanstack/react-query";
import { WarehousesApi } from "@/services/api/ecommerce/warehouses";
import { CategoriesApi } from "@/services/api/ecommerce/categories";

interface ProductInventoryInfoProps {
  form: UseFormReturn<CreateProductFormData>;
}

export default function ProductInventoryInfo({
  form,
}: ProductInventoryInfoProps) {
  const warehousesQuery = useQuery({
    queryKey: ["ProductInventoryInfo", "warehouses-list"],
    queryFn: async () => WarehousesApi.list(),
  });
  const categoriesQuery = useQuery({
    queryKey: ["ProductInventoryInfo", "productCategories-list"],
    queryFn: async () => CategoriesApi.list(),
  });
  const subCategoriesQuery = useQuery({
    queryKey: ["ProductInventoryInfo", "subCategories-list"],
    queryFn: async () => CategoriesApi.list(),
  });

  return (
    <div className="grid grid-cols-4 gap-6">
      <div>
        <Label className="text-gray-400 text-sm mb-2 block">المخزن</Label>
        <Controller
          control={form.control}
          name="warehouse_id"
          render={({ field }) => (
            <SimpleSelect
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
              options={
                warehousesQuery.data?.data?.payload.map((warehouse) => ({
                  label: warehouse.name,
                  value: warehouse.id.toString(),
                })) || []
              }
              valueProps={{
                placeholder: "اختر المخزن",
              }}
            />
          )}
        />
        <ErrorTypography>
          {form.formState.errors.warehouse_id?.message}
        </ErrorTypography>
      </div>
      <div>
        <Label className="text-gray-400 text-sm mb-2 block">الكمية</Label>
        <Input placeholder="8000" type="number" />
      </div>
      <div>
        <Label className="text-gray-400 text-sm mb-2 block">
          التصنيف الرئيسي
        </Label>
        <Controller
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <SimpleSelect
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
              options={
                categoriesQuery.data?.data?.payload.map((category) => ({
                  label: category.name,
                  value: category.id.toString(),
                })) || []
              }
              valueProps={{
                placeholder: "اختر التصنيف الرئيسي",
              }}
            />
          )}
        />
        <ErrorTypography>
          {form.formState.errors.category_id?.message}
        </ErrorTypography>
      </div>
      <div>
        <Label className="text-gray-400 text-sm mb-2 block">
          التصنيف الفرعي
        </Label>
        <Controller
          control={form.control}
          name="sub_category_id"
          render={({ field }) => (
            <SimpleSelect
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
              options={
                subCategoriesQuery.data?.data?.payload.map((subCategory) => ({
                  label: subCategory.name,
                  value: subCategory.id.toString(),
                })) || []
              }
              valueProps={{
                placeholder: "اختر التصنيف الفرعي",
              }}
            />
          )}
        />
        <ErrorTypography>
          {form.formState.errors.sub_category_id?.message}
        </ErrorTypography>
      </div>
    </div>
  );
}
