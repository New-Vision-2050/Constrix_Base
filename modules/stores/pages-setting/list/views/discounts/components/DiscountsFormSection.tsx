"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/modules/table/components/ui/form";
import { Input } from "@/modules/table/components/ui/input";
import { Textarea } from "@/modules/table/components/ui/textarea";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/config/axios-config";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

// Validation schema factory
const createDiscountsPageSchema = (t: (key: string) => string) =>
  z.object({
    title_header: z.string().min(1, { message: t("validation.titleRequired") }),
    description_header: z
      .string()
      .min(1, { message: t("validation.descriptionRequired") }),
  });

interface DiscountsFormSectionProps {
  pageType: string;
  onSuccess?: () => void;
  onSettingPageIdChange?: (id: string) => void;
}

export default function DiscountsFormSection({
  pageType,
  onSuccess,
  onSettingPageIdChange,
}: DiscountsFormSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("pagesSettings");

  // Fetch existing data for this page type
  const { data: pageData, isLoading } = useQuery({
    queryKey: ["setting-page", pageType],
    queryFn: () =>
      apiClient.get(
        `/ecommerce/dashboard/setting-pages/by-type?type=${pageType}`
      ),
  });

  const discountsPageSchema = createDiscountsPageSchema(t);
  type DiscountsFormData = z.infer<typeof discountsPageSchema>;

  const form = useForm<DiscountsFormData>({
    resolver: zodResolver(discountsPageSchema),
    defaultValues: {
      title_header: "",
      description_header: "",
    },
  });

  // Populate form when data is fetched
  useEffect(() => {
    if (pageData?.data?.payload) {
      const data = pageData.data.payload;
      // Save the setting page ID and notify parent
      if (data.id) {
        onSettingPageIdChange?.(data.id);
      }
      form.reset({
        title_header: data.title_header || "",
        description_header: data.description_header || "",
      });
    }
  }, [pageData, form, onSettingPageIdChange]);

  const onSubmit = async (data: DiscountsFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        type: pageType,
        title_header: data.title_header,
        description_header: data.description_header,
      };

      await apiClient.post(
        "/ecommerce/dashboard/setting-pages/upsert",
        payload
      );

      toast.success(t("messages.saveSuccess"));
      onSuccess?.();
    } catch (error: any) {
      console.error("Error saving data:", error);
      toast.error(t("messages.saveError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errors: any) => {
    console.log("Validation errors:", errors);
    toast.error(t("validation.fillRequired"));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="space-y-6 mt-6"
      >
        {/* Main Section Card */}
        <h3 className="text-white text-lg font-semibold">
          {t("sections.header")}
        </h3>
        <div className="bg-sidebar border border-[#3c345a] rounded-lg p-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title_header"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{t("fields.titleHeader")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description_header"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>
                    {t("fields.descriptionHeader")}
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} className="bg-sidebar" />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-start gap-4">
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="bg-primary text-white px-8 mb-6"
          >
            {isSubmitting
              ? t("actions.saving")
              : isLoading
              ? t("actions.loading")
              : t("actions.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
