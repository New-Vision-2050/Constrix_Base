"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Form } from "@/modules/table/components/ui/form";
import { Loader2 } from "lucide-react";
import {
  createOurServicesFormSchema,
  getDefaultOurServicesFormValues,
  OurServicesFormData,
} from "./schemas/our-services-form.schema";
import { Department } from "./types";
import { toast } from "sonner";
import MainSection from "./components/main-section";
import DepartmentsList from "./components/departments-list";

export default function OurServicesModule() {
  const tForm = useTranslations("content-management-system.our-services.form");

  const form = useForm<OurServicesFormData>({
    resolver: zodResolver(createOurServicesFormSchema(tForm)),
    defaultValues: getDefaultOurServicesFormValues(),
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = form;

  const departments = watch("departments");

  const addDepartment = () => {
    const newDepartment: Department = {
      id: `${departments.length + 1}`,
      titleAr: "",
      titleEn: "",
      descriptionAr: "",
      descriptionEn: "",
      designType: "",
      services: Array.from({ length: 6 }, (_, i) => ({
        id: `${i + 1}`,
        value: "تصميم مواقع",
      })),
    };
    setValue("departments", [...departments, newDepartment]);
  };

  const removeDepartment = (index: number) => {
    if (departments.length > 1) {
      const updatedDepartments = departments.filter((_, i) => i !== index);
      setValue("departments", updatedDepartments);
    } else {
      toast.error(
        tForm("cannotRemoveLastDepartment") ||
          "Cannot remove the last department"
      );
    }
  };

  const onSubmit = async (data: OurServicesFormData) => {
    try {
      // TODO: Implement API call here
      console.log("Form data:", data);
      toast.success(tForm("saveSuccess") || "Saved successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      toast.error(tForm("saveError") || "Failed to save. Please try again.");
    }
  };

  return (
    <div className="container p-6">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Main Section */}
          <MainSection control={control} isSubmitting={isSubmitting} />

          {/* Departments Section */}
          <DepartmentsList
            control={control}
            departments={departments}
            isSubmitting={isSubmitting}
            onAdd={addDepartment}
            onRemove={removeDepartment}
          />

          {/* Submit Button */}
          <div className="mt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {tForm("save")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
