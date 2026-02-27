"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/modules/table/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
} from "@/modules/table/components/ui/form";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProjectTermsApi } from "@/services/api/projects/project-terms";
import { Checkbox } from "@/components/ui/checkbox";

interface AddProjectTermDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  projectTypeId: number | null;
  parentId?: number | null;
}

const createTermSettingSchema = (t: any) => z.object({
  name: z.string().min(1, t('validation.nameRequired')),
  description: z.string().optional(),
  term_services_ids: z.array(z.number()).min(1, t('validation.servicesRequired')),
});

type TermSettingFormData = {
  name: string;
  description?: string;
  term_services_ids: number[];
};

export function AddProjectTermDialog({ open, onClose, onSuccess, projectTypeId, parentId }: AddProjectTermDialogProps) {
  const t = useTranslations('CRMSettingsModule.terms');
  
  const form = useForm<TermSettingFormData>({
    resolver: zodResolver(createTermSettingSchema(t)),
    defaultValues: {
      name: "",
      description: "",
      term_services_ids: [],
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  // Fetch term services
  const { data: termServicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ["term-services"],
    queryFn: async () => {
      const response = await ProjectTermsApi.getTermServices({
        page: 1,
        per_page: 100,
      });
      return response.data;
    },
    enabled: open,
  });

  const termServices = termServicesData?.payload || [];

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(firstError.message as string);
      }
    }
  }, [errors]);

  useEffect(() => {
    if (open) {
      reset({
        name: "",
        description: "",
        term_services_ids: [],
      });
    }
  }, [open, reset]);

  const onSubmit = async (data: TermSettingFormData) => {
    try {
      await ProjectTermsApi.createTermSetting({
        name: data.name,
        description: data.description,
        project_type_id: projectTypeId,
        parent_id: parentId || null,
        term_services_ids: data.term_services_ids,
      });

      toast.success(t('success.created'));
      onSuccess?.();
      reset();
      onClose();
    } catch (error: any) {
      console.error("Error creating term setting:", error);
      
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors;
        if (validationErrors) {
          const firstErrorKey = Object.keys(validationErrors)[0];
          const firstErrorMessage = validationErrors[firstErrorKey][0];
          toast.error(firstErrorMessage || t('validation.validationError'));
          return;
        }
      }
      
      toast.error(t('error.createFailed'));
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl w-full bg-sidebar max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            {parentId ? t('dialog.addTitle') : t('dialog.addTitle')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs" required>
                    {t('form.name')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      variant="secondary"
                      disabled={isSubmitting}
                      className="mt-1 bg-sidebar border-gray-700"
                      placeholder={t('form.namePlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    {t('form.description')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      rows={3}
                      className="mt-1 resize-none bg-sidebar border-gray-700"
                      placeholder={t('form.descriptionPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />

            {/* Term Services Multi-Select */}
            <FormField
              control={control}
              name="term_services_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs" required>
                    {t('form.services')}
                  </FormLabel>
                  <div className="border border-gray-700 rounded-md p-4 bg-sidebar space-y-3">
                    {isLoadingServices ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : (
                      termServices.map((service) => (
                        <div key={service.id} className="flex items-center space-x-2 space-x-reverse">
                          <Checkbox
                            id={`service-${service.id}`}
                            checked={field.value?.includes(service.id)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || [];
                              if (checked) {
                                field.onChange([...currentValues, service.id]);
                              } else {
                                field.onChange(
                                  currentValues.filter((id) => id !== service.id)
                                );
                              }
                            }}
                            disabled={isSubmitting}
                          />
                          <label
                            htmlFor={`service-${service.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {service.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                  <FormErrorMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="mt-6">
              <Button
                type="submit"
                disabled={isSubmitting || isLoadingServices}
                className="w-full"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t('form.save')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
