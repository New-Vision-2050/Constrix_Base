"use client";

import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/modules/table/components/ui/textarea";
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
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { Trash2 } from "lucide-react";
import { OurServicesFormData } from "../schemas/our-services-form.schema";
import { Department } from "../types";
import ServicesGrid from "./services-grid";

// Design type options
const DESIGN_TYPE_OPTIONS = [
  { value: "hexagonal", labelAr: "شكل سداسي", labelEn: "Hexagonal Shape" },
  { value: "circular", labelAr: "شكل دائري", labelEn: "Circular Shape" },
  { value: "square", labelAr: "شكل مربع", labelEn: "Square Shape" },
];

interface DepartmentSectionProps {
  control: Control<OurServicesFormData>;
  department: Department;
  departmentIndex: number;
  totalDepartments: number;
  isSubmitting: boolean;
  onRemove: () => void;
}

export default function DepartmentSection({
  control,
  department,
  departmentIndex,
  totalDepartments,
  isSubmitting,
  onRemove,
}: DepartmentSectionProps) {
  const isRtl = useIsRtl();
  const t = useTranslations("content-management-system.our-services");
  const tForm = useTranslations("content-management-system.our-services.form");

  return (
    <div className="space-y-4 pt-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">
          {t("departmentNumber")} {departmentIndex + 1}
        </h2>
        {totalDepartments > 1 && (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Department Titles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Arabic Title */}
        <FormField
          control={control}
          name={`departments.${departmentIndex}.titleAr`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs" required>
                {tForm("departmentTitleAr")}
              </FormLabel>
              <FormControl>
                <Input
                  variant="secondary"
                  disabled={isSubmitting}
                  className="mt-1"
                  placeholder={tForm("departmentTitleArPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        {/* English Title */}
        <FormField
          control={control}
          name={`departments.${departmentIndex}.titleEn`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs" required>
                {tForm("departmentTitleEn")}
              </FormLabel>
              <FormControl>
                <Input
                  variant="secondary"
                  disabled={isSubmitting}
                  className="mt-1"
                  placeholder={tForm("departmentTitleEnPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Department Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Arabic Description */}
        <FormField
          control={control}
          name={`departments.${departmentIndex}.descriptionAr`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs" required>
                {tForm("departmentDescriptionAr")}
              </FormLabel>
              <FormControl>
                <Textarea
                  disabled={isSubmitting}
                  className="mt-1 min-h-[100px] bg-sidebar text-white"
                  placeholder={tForm("departmentDescriptionArPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        {/* English Description */}
        <FormField
          control={control}
          name={`departments.${departmentIndex}.descriptionEn`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs" required>
                {tForm("departmentDescriptionEn")}
              </FormLabel>
              <FormControl>
                <Textarea
                  disabled={isSubmitting}
                  className="mt-1 min-h-[100px] bg-sidebar text-white"
                  placeholder={tForm("departmentDescriptionEnPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Design Type */}
      <FormField
        control={control}
        name={`departments.${departmentIndex}.designType`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs" required>
              {tForm("designType")}
            </FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  className="mt-1 bg-sidebar text-white h-12"
                  showClear={!!field.value}
                  onClear={() => field.onChange("")}
                >
                  <SelectValue placeholder={tForm("designTypePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {DESIGN_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {isRtl ? option.labelAr : option.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormErrorMessage />
          </FormItem>
        )}
      />

      {/* Services Grid */}
      <ServicesGrid
        control={control}
        services={department.services}
        departmentIndex={departmentIndex}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
