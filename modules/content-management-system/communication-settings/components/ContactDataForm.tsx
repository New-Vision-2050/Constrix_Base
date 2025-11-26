"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, FormField, FormItem, FormControl } from "@/modules/table/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { Loader2 } from "lucide-react";
import PhoneField from "@/modules/form-builder/components/fields/PhoneField";
import { toast } from "sonner";
import { CommunicationWebsiteContactInfoApi } from "@/services/api/company-dashboard/communication-settings";
import { createContactDataSchema, DEFAULT_CONTACT_DATA, ContactDataFormValues } from "../schema/contact-data.schema";
import withPermissions from "@/lib/permissions/client/withPermissions";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

/**
 * ContactDataForm - Email and phone contact form with validation
 */
function ContactDataForm() {
  const t = useTranslations("content-management-system.communicationSetting");
  const queryClient = useQueryClient();

  // Fetch contact info
  const { data: contactData, isLoading: isLoadingData } = useQuery({
    queryKey: ["cms-contact-info"],
    queryFn: async () => {
      const response = await CommunicationWebsiteContactInfoApi.getCurrent();
      return response?.data?.payload;
    },
  });

  const form = useForm<ContactDataFormValues>({
    resolver: zodResolver(createContactDataSchema(t)),
    defaultValues: DEFAULT_CONTACT_DATA,
  });

  const { control, handleSubmit, reset, formState: { isSubmitting } } = form;

  // Update form values when data is loaded
  useEffect(() => {
    if (contactData) {
      reset({
        email: contactData.email || "",
        phone: contactData.phone || "",
      });
    }
  }, [contactData, reset]);

  // Mutation for updating contact info
  const updateMutation = useMutation({
    mutationFn: async (data: ContactDataFormValues) => {
      return await CommunicationWebsiteContactInfoApi.update({
        email: data.email,
        phone: data.phone,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch the contact info
      queryClient.invalidateQueries({ queryKey: ["cms-contact-info"] });
      toast.success(t("updateSuccess") || "Contact info updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t("updateFailed") || "Failed to update contact info");
    },
  });

  const onSubmit = async (data: ContactDataFormValues) => {
    updateMutation.mutate(data);
  };

  const isDisabled = isSubmitting || isLoadingData || updateMutation.isPending;

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6 bg-sidebar rounded-lg p-6 border border-border">
            <h2 className="text-lg font-semibold">{t("formTitle")}</h2>

            <FormField control={control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("email")}</FormLabel>
                <FormControl>
                  <Input variant="secondary" disabled={isDisabled} placeholder={t("emailPlaceholder")} {...field} />
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
                      disabled: isDisabled,
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

          <Button type="submit" disabled={isDisabled}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700">
            {isDisabled && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("saveButton")}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default withPermissions(ContactDataForm, [PERMISSIONS.CMS.communicationSettings.contactData.update]);

