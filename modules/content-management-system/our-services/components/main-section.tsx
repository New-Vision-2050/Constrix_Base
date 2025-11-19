"use client";

import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/modules/table/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormControl,
} from "@/modules/table/components/ui/form";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { OurServicesFormData } from "../schemas/our-services-form.schema";

interface MainSectionProps {
  control: Control<OurServicesFormData>;
  isSubmitting: boolean;
}

export default function MainSection({
  control,
  isSubmitting,
}: MainSectionProps) {
  const t = useTranslations("content-management-system.our-services");
  const tForm = useTranslations("content-management-system.our-services.form");

  return (
    <div className="space-y-4 bg-sidebar p-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        {t("mainSection")}
      </h2>

      {/* Main Title */}
      <FormField
        control={control}
        name="mainTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs" required>
              {tForm("mainTitle")}
            </FormLabel>
            <FormControl>
              <Input
                variant="secondary"
                disabled={isSubmitting}
                className="mt-1"
                placeholder={tForm("mainTitlePlaceholder")}
                {...field}
              />
            </FormControl>
            <FormErrorMessage />
          </FormItem>
        )}
      />

      {/* Main Description */}
      <FormField
        control={control}
        name="mainDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs" required>
              {tForm("mainDescription")}
            </FormLabel>
            <FormControl>
              <Textarea
                disabled={isSubmitting}
                className="mt-1 min-h-[100px] bg-sidebar border-gray-700 text-white"
                placeholder={tForm("mainDescriptionPlaceholder")}
                {...field}
              />
            </FormControl>
            <FormErrorMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
