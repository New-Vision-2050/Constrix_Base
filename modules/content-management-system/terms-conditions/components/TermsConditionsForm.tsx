"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
} from "@/modules/table/components/ui/form";
import { Loader2 } from "lucide-react";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import RichTextEditor from "@/modules/stores/terms/components/RichTextEditor";
import { toast } from "sonner";
import {
    createTermsConditionsFormSchema,
    TermsConditionsFormData,
    getDefaultTermsConditionsFormValues,
} from "../schema/terms-conditions-form.schema";

export default function TermsConditionsForm() {
    const t = useTranslations("content-management-system.termsConditions.form");

    const form = useForm<TermsConditionsFormData>({
        resolver: zodResolver(createTermsConditionsFormSchema(t)),
        defaultValues: getDefaultTermsConditionsFormValues(),
    });

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = form;

    // Show toast for validation errors
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];
            if (firstError?.message) {
                toast.error(firstError.message as string);
            }
        }
    }, [errors]);

    const onSubmit = async (data: TermsConditionsFormData) => {
        try {
            // TODO: Replace with actual API call
            // await TermsConditionsApi.update(data);
            toast.success(t("updateSuccess") || "Terms and conditions updated successfully!");
        } catch (error: any) {
            console.error("Error updating terms and conditions:", error);

            if (error?.response?.status === 422) {
                const validationErrors = error?.response?.data?.errors;
                if (validationErrors) {
                    const firstErrorKey = Object.keys(validationErrors)[0];
                    const firstErrorMessage = validationErrors[firstErrorKey][0];
                    toast.error(firstErrorMessage || t("validationError"));
                    return;
                }
            }

            toast.error(
                t("updateError") || "Failed to update terms and conditions. Please try again."
            );
        }
    };

    return (
        <div className="px-6 py-4">
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Terms and Conditions Content */}
                    <div className="bg-sidebar rounded-lg p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-white">
                            {t("title") || "بيانات الشروط والاحكام"}
                        </h2>

                        <FormField
                            control={control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <RichTextEditor
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            placeholder={t("contentPlaceholder") || "أدخل محتوى الشروط والاحكام هنا..."}
                                        />
                                    </FormControl>
                                    <FormErrorMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
                        >
                            {isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {t("saveChanges") || "حفظ التعديل"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

