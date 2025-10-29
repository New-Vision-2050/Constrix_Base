"use client";

import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
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
import FormLabel from "@/components/shared/FormLabel";
import MultiSelect from "@/components/shared/MultiSelect";
import { CategoriesApi } from "@/services/api/ecommerce/categories";
import { BrandsApi } from "@/services/api/ecommerce/brands";
import { getCountries } from "@/services/api/shared/countries";
import { WarehousesApi } from "@/services/api/ecommerce/warehouses";
import { getUnits } from "@/services/api/shared/units";
import { useTranslations } from "next-intl";

interface ProductInventoryFieldsProps {
  form: UseFormReturn<any>;
}

export default function ProductInventoryFields({
  form,
}: ProductInventoryFieldsProps) {
  const t = useTranslations("product");
  const productType = form.watch("type");
  const isSerial = productType === "serial";
  const selectedCategoryId = form.watch("category_id");
  const selectedSubCategoryId = form.watch("sub_category_id");
  const [unitIdToName, setUnitIdToName] = useState<Record<string, string>>({});
  const [prevCategoryId, setPrevCategoryId] = useState<string>("");
  const [prevSubCategoryId, setPrevSubCategoryId] = useState<string>("");

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

  // Create a map of country ID to name for display
  const countryIdToName: Record<string, string> = {};
  countries.forEach((country: any) => {
    countryIdToName[country.id] = country.name;
  });

  // Fetch warehouses
  const { data: warehousesData, isLoading: isLoadingWarehouses } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => WarehousesApi.list(),
  });

  const warehouses = warehousesData?.data?.payload || [];

  // Fetch units
  const { data: unitsData, isLoading: isLoadingUnits } = useQuery({
    queryKey: ["units"],
    queryFn: () => getUnits(),
  });

  const units = unitsData?.data?.payload || [];

  // Create unit ID to name mapping
  useEffect(() => {
    if (units.length > 0) {
      const mapping: Record<string, string> = {};
      units.forEach((unit: any) => {
        mapping[unit.id.toString()] = unit.name_ar || unit.name_en || unit.name;
      });
      setUnitIdToName(mapping);

      // When editing, ensure the unit value is properly set
      const currentUnit = form.getValues("unit");
      if (currentUnit && !Object.values(mapping).includes(currentUnit)) {
        // If current unit value doesn't match any unit name, try to find it by ID
        const unitById = units.find(
          (u: any) => u.id.toString() === currentUnit
        );
        if (unitById) {
          form.setValue(
            "unit",
            unitById.name_ar || unitById.name_en || unitById.name
          );
        }
      }
    }
  }, [units, form]);

  // Reset sub_category when main category changes (only on user interaction)
  useEffect(() => {
    if (prevCategoryId && selectedCategoryId !== prevCategoryId) {
      form.setValue("sub_category_id", "");
      form.setValue("sub_sub_category_id", "");
    }
    setPrevCategoryId(selectedCategoryId);
  }, [selectedCategoryId, prevCategoryId, form]);

  // Reset sub_sub_category when sub-category changes (only on user interaction)
  useEffect(() => {
    if (prevSubCategoryId && selectedSubCategoryId !== prevSubCategoryId) {
      form.setValue("sub_sub_category_id", "");
    }
    setPrevSubCategoryId(selectedSubCategoryId);
  }, [selectedSubCategoryId, prevSubCategoryId, form]);

  return (
    <div className="space-y-6">
      {/* First Row: الجهزة - الجهزة الالكترونية - الوقائي */}
      <div className="grid grid-cols-3 gap-6">
        {/* القسم */}
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{t("fields.category")}</FormLabel>
              <Select
                key={field.value}
                onValueChange={field.onChange}
                value={field.value || undefined}
                disabled={isLoadingCategories}
              >
                <FormControl>
                  <SelectTrigger
                    showClear={!!field.value}
                    onClear={() => field.onChange("")}
                  >
                    <SelectValue
                      placeholder={
                        isLoadingCategories
                          ? t("placeholders.loading")
                          : t("placeholders.selectCategory")
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
          name="sub_category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.subCategory")}</FormLabel>
              <Select
                key={field.value}
                onValueChange={field.onChange}
                value={field.value || undefined}
                disabled={!selectedCategoryId || isLoadingSubCategories}
              >
                <FormControl>
                  <SelectTrigger
                    showClear={!!field.value}
                    onClear={() => field.onChange("")}
                  >
                    <SelectValue
                      placeholder={
                        !selectedCategoryId
                          ? t("placeholders.selectMainCategoryFirst")
                          : isLoadingSubCategories
                          ? t("placeholders.loading")
                          : t("placeholders.selectSubCategory")
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subCategories.length === 0 && selectedCategoryId ? (
                    <div className="px-2 py-1.5 text-sm text-gray-500">
                      {t("messages.noSubCategories")}
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
          name="sub_sub_category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.subSubCategory")}</FormLabel>
              <Select
                key={field.value}
                onValueChange={field.onChange}
                value={field.value || undefined}
                disabled={!selectedSubCategoryId || isLoadingSubSubCategories}
              >
                <FormControl>
                  <SelectTrigger
                    showClear={!!field.value}
                    onClear={() => field.onChange("")}
                  >
                    <SelectValue
                      placeholder={
                        !selectedSubCategoryId
                          ? t("placeholders.selectSubCategoryFirst")
                          : isLoadingSubSubCategories
                          ? t("placeholders.loading")
                          : t("placeholders.selectSubSubCategory")
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subSubCategories.length === 0 && selectedSubCategoryId ? (
                    <div className="px-2 py-1.5 text-sm text-gray-500">
                      {t("messages.noSubSubCategories")}
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
          name="brand_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.brand")}</FormLabel>
              <Select
                key={field.value}
                onValueChange={field.onChange}
                value={field.value || undefined}
                disabled={isLoadingBrands}
              >
                <FormControl>
                  <SelectTrigger
                    showClear={!!field.value}
                    onClear={() => field.onChange("")}
                  >
                    <SelectValue
                      placeholder={
                        isLoadingBrands
                          ? t("placeholders.loading")
                          : t("placeholders.selectBrand")
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
          name="country_ids"
          render={({ field }) => {
            // Convert IDs to names for display
            const displayNames = (field.value || []).map(
              (id: string) => countryIdToName[id] || id
            );

            return (
              <FormItem>
                <FormLabel>{t("fields.country")}</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={
                      isLoadingCountries
                        ? []
                        : countries.map((c: any) => c.name)
                    }
                    value={displayNames}
                    onChange={(names) => {
                      // Convert names back to IDs
                      const ids = names.map((name) => {
                        const country = countries.find(
                          (c: any) => c.name === name
                        );
                        return country ? country.id.toString() : name;
                      });
                      field.onChange(ids);
                    }}
                    placeholder={
                      isLoadingCountries
                        ? t("placeholders.loading")
                        : t("placeholders.selectCountries")
                    }
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            );
          }}
        />

        {/* النوع */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{t("fields.productType")}</FormLabel>
              <Select
                key={field.value}
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger
                    showClear={!!field.value}
                    onClear={() => field.onChange("")}
                  >
                    <SelectValue placeholder={t("placeholders.selectType")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="normal">{t("options.normal")}</SelectItem>
                  <SelectItem value="serial">{t("options.serial")}</SelectItem>
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
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("fields.unit")}</FormLabel>
                <Select
                  onValueChange={(value) => {
                    // Store the unit name instead of ID
                    const unitName = unitIdToName[value];
                    field.onChange(unitName);
                  }}
                  value={
                    // Find the ID from the name for display
                    Object.keys(unitIdToName).find(
                      (id) => unitIdToName[id] === field.value
                    ) || ""
                  }
                  disabled={isLoadingUnits}
                >
                  <FormControl>
                    <SelectTrigger
                      showClear={!!field.value}
                      onClear={() => field.onChange("")}
                    >
                      <SelectValue
                        placeholder={
                          isLoadingUnits
                            ? t("placeholders.loading")
                            : t("placeholders.selectUnit")
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {units.map((unit: any) => (
                      <SelectItem key={unit.id} value={unit.id.toString()}>
                        {unit.name_ar || unit.name_en || unit.name}
                      </SelectItem>
                    ))}
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
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{t("fields.gender")}</FormLabel>
              <Select
                key={field.value}
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger
                    showClear={!!field.value}
                    onClear={() => field.onChange("")}
                  >
                    <SelectValue placeholder={t("placeholders.selectType")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">{t("options.male")}</SelectItem>
                  <SelectItem value="female">{t("options.female")}</SelectItem>
                  <SelectItem value="all">{t("options.all")}</SelectItem>
                </SelectContent>
              </Select>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        {/* المخزن */}
        <FormField
          control={form.control}
          name="warehouse_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{t("fields.warehouse")}</FormLabel>
              <Select
                key={field.value}
                onValueChange={field.onChange}
                value={field.value || undefined}
                disabled={isLoadingWarehouses}
              >
                <FormControl>
                  <SelectTrigger
                    showClear={!!field.value}
                    onClear={() => field.onChange("")}
                  >
                    <SelectValue
                      placeholder={
                        isLoadingWarehouses
                          ? t("placeholders.loading")
                          : t("placeholders.selectWarehouse")
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {warehouses.map((warehouse: any) => (
                    <SelectItem
                      key={warehouse.id}
                      value={warehouse.id.toString()}
                    >
                      {warehouse.name_ar || warehouse.name_en || warehouse.name}
                    </SelectItem>
                  ))}
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
