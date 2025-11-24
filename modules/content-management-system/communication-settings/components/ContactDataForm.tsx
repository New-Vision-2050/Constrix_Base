"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Form, FormField, FormItem, FormControl } from "@/modules/table/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { Loader2 } from "lucide-react";
import PhoneField from "@/modules/form-builder/components/fields/PhoneField";
import { createContactDataSchema, DEFAULT_CONTACT_DATA, ContactDataFormValues } from "../schema/contact-data.schema";

/**
 * ContactDataForm - Email and phone contact form with validation
 * @param onSubmit - Async callback for form submission
 * @param initialValues - Optional initial form values
 */
interface ContactDataFormProps {
  initialValues?: Partial<ContactDataFormValues>;
}

export default function ContactDataForm({ initialValues }: ContactDataFormProps) {
  const t = useTranslations("content-management-system.communicationSetting");
  const form = useForm<ContactDataFormValues>({
    resolver: zodResolver(createContactDataSchema(t)),
    defaultValues: { ...DEFAULT_CONTACT_DATA, ...initialValues },
  });

  const { control, handleSubmit, formState: { isSubmitting } } = form;

  const onSubmit = async (data: ContactDataFormValues) => {
    console.log(data);
  };

  return (
    <div className="px-6 py-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(async (data) => await onSubmit?.(data))} className="space-y-6">
          <div className="space-y-6 bg-sidebar rounded-lg p-6 border border-border">
            <h2 className="text-lg font-semibold">{t("formTitle")}</h2>

            <FormField control={control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("email")}</FormLabel>
                <FormControl>
                  <Input variant="secondary" disabled={isSubmitting} placeholder={t("emailPlaceholder")} {...field} />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            )} />

            <FormField control={control} name="phone" render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel required>{t("phone")}</FormLabel>
                <FormControl>
                  <PhoneField
                    field={{
                      name: field.name,
                      label: t("phone"),
                      type: "phone",
                      placeholder: t("phonePlaceholder"),
                      disabled: isSubmitting,
                      required: true,
                    }}
                    value={field.value || ""}
                    error={fieldState.error?.message}
                    touched={fieldState.isTouched}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            )} />
          </div>

          <Button type="submit" disabled={isSubmitting}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("saveButton")}
          </Button>
        </form>
      </Form>
    </div>
  );
}

