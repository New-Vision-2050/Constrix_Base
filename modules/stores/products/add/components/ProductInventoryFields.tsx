"use client";

import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Input } from "@/modules/table/components/ui/input";
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
import MultiSelect from "@/components/shared/MultiSelect";
import { CategoriesApi } from "@/services/api/ecommerce/categories";
import { BrandsApi } from "@/services/api/ecommerce/brands";
import { getCountries } from "@/services/api/shared/countries";

interface ProductInventoryFieldsProps {
  form: UseFormReturn<any>;
}

export default function ProductInventoryFields({
  form,
}: ProductInventoryFieldsProps) {
  const productType = form.watch("type-product");
  const isSerial = productType === "serial";
  const selectedCategoryId = form.watch("category");
  const selectedSubCategoryId = form.watch("sub_category");

  // Fetch main categories
  const { data: mainCategoriesData, isLoading: isLoadingCategories } = useQuery(
    {
      queryKey: ["main-categories"],
      queryFn: () => CategoriesApi.list({ depth: "0" }),
    }
  );

  const categories = mainCategoriesData?.data?.payload || [];

  // Fetch sub-categories based on selected main category
  const { data: subCategoriesData, isLoading: isLoadingSubCategories } =
    useQuery({
      queryKey: ["sub-categories", selectedCategoryId],
      queryFn: () => CategoriesApi.list({ parent_id: selectedCategoryId }),
      enabled: !!selectedCategoryId,
    });

  const subCategories = subCategoriesData?.data?.payload || [];

  // Fetch sub-sub-categories based on selected sub-category
  const { data: subSubCategoriesData, isLoading: isLoadingSubSubCategories } =
    useQuery({
      queryKey: ["sub-sub-categories", selectedSubCategoryId],
      queryFn: () => CategoriesApi.list({ parent_id: selectedSubCategoryId }),
      enabled: !!selectedSubCategoryId,
    });

  const subSubCategories = subSubCategoriesData?.data?.payload || [];

  // Fetch brands
  const { data: brandsData, isLoading: isLoadingBrands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => BrandsApi.list(),
  });

  const brands = brandsData?.data?.payload || [];

  // Fetch countries
  const { data: countriesData, isLoading: isLoadingCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
  });

  const countries = countriesData?.data?.payload || [];
  const countryNames = countries.map((country: any) => country.name);

  // Reset sub_category when main category changes
  useEffect(() => {
    form.setValue("sub_category", "");
    form.setValue("sub__sub_category", "");
  }, [selectedCategoryId, form]);

  // Reset sub__sub_category when sub-category changes
  useEffect(() => {
    form.setValue("sub__sub_category", "");
  }, [selectedSubCategoryId, form]);

  return (
    <div className="space-y-6">
      {/* First Row: الجهزة - الجهزة الالكترونية - الوقائي */}
      <div className="grid grid-cols-3 gap-6">
        {/* القسم */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <Label className="text-gray-400 text-sm mb-2 block">القسم</Label>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoadingCategories}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingCategories ? "جاري التحميل..." : "اختر القسم"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name_ar || category.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        {/* القسم الفرعي */}
        <FormField
          control={form.control}
          name="sub_category"
          render={({ field }) => (
            <FormItem>
              <Label className="text-gray-400 text-sm mb-2 block">
                قسم الفرعي
              </Label>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!selectedCategoryId || isLoadingSubCategories}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !selectedCategoryId
                          ? "اختر القسم الرئيسي أولاً"
                          : isLoadingSubCategories
                          ? "جاري التحميل..."
                          : "اختر القسم الفرعي"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subCategories.length === 0 && selectedCategoryId ? (
                    <div className="px-2 py-1.5 text-sm text-gray-500">
                      لا توجد أقسام فرعية
                    </div>
                  ) : (
                    subCategories.map((category: any) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name_ar || category.name_en}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        {/* القسم الفرعي الثاني */}
        <FormField
          control={form.control}
          name="sub__sub_category"
          render={({ field }) => (
            <FormItem>
              <Label className="text-gray-400 text-sm mb-2 block">
                قسم فرعي فرعي
              </Label>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!selectedSubCategoryId || isLoadingSubSubCategories}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !selectedSubCategoryId
                          ? "اختر القسم الفرعي أولاً"
                          : isLoadingSubSubCategories
                          ? "جاري التحميل..."
                          : "اختر القسم الفرعي الفرعي"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subSubCategories.length === 0 && selectedSubCategoryId ? (
                    <div className="px-2 py-1.5 text-sm text-gray-500">
                      لا توجد أقسام فرعية فرعية
                    </div>
                  ) : (
                    subSubCategories.map((category: any) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name_ar || category.name_en}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormErrorMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Second Row: الوحدة التجارية - الدولة - النوع */}
      <div className="grid grid-cols-3 gap-6">
        {/* العلامة التجارية */}
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <Label className="text-gray-400 text-sm mb-2 block">
                العلامة التجارية
              </Label>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoadingBrands}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingBrands
                          ? "جاري التحميل..."
                          : "اختر العلامة التجارية"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {brands.map((brand: any) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name_ar || brand.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        {/* الدولة - multi-select */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <Label className="text-gray-400 text-sm mb-2 block">الدولة</Label>
              <FormControl>
                <MultiSelect
                  options={isLoadingCountries ? [] : countryNames}
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder={
                    isLoadingCountries ? "جاري التحميل..." : "اختر الدول"
                  }
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        {/* النوع */}
        <FormField
          control={form.control}
          name="type-product"
          render={({ field }) => (
            <FormItem>
              <Label className="text-gray-400 text-sm mb-2 block">
                نوع المنتح
              </Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="عادي" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="normal">عادي</SelectItem>
                  <SelectItem value="serial">رقمي</SelectItem>
                </SelectContent>
              </Select>
              <FormErrorMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Third Row: الوحدة - الوزن - KG */}
      <div className={`grid gap-6 ${isSerial ? "grid-cols-2" : "grid-cols-3"}`}>
        {/* الوحدة - Only show if NOT serial */}
        {!isSerial && (
          <FormField
            control={form.control}
            name="weight_unit"
            render={({ field }) => (
              <FormItem>
                <Label className="text-gray-400 text-sm mb-2 block">
                  الوحدة
                </Label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="KG" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="kg">KG</SelectItem>
                    <SelectItem value="g">G</SelectItem>
                    <SelectItem value="lb">LB</SelectItem>
                  </SelectContent>
                </Select>
                <FormErrorMessage />
              </FormItem>
            )}
          />
        )}

        {/* النوع */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <Label className="text-gray-400 text-sm mb-2 block">النوع</Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="ذكر" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">ذكر</SelectItem>
                  <SelectItem value="female">انثى</SelectItem>
                </SelectContent>
              </Select>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        {/* المخزن */}
        <FormField
          control={form.control}
          name="warehouse"
          render={({ field }) => (
            <FormItem>
              <Label className="text-gray-400 text-sm mb-2 block">المخزن</Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="المخزن" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="warehouse1">المخزن 1</SelectItem>
                  <SelectItem value="warehouse2">المخزن 2</SelectItem>
                </SelectContent>
              </Select>
              <FormErrorMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
