"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Form } from "@/modules/table/components/ui/form";
import {
    createTermsConditionsFormSchema,
    TermsConditionsFormData,
    getDefaultTermsConditionsFormValues,
} from "../schema/terms-conditions-form.schema";
import { useTermsConditions } from "../hooks/useTermsConditions";
import { useFormErrorToast } from "../hooks/useFormErrorToast";
import LoadingState from "./LoadingState";
import TermsConditionsEditor from "./TermsConditionsEditor";
import SubmitButton from "./SubmitButton";

/**
 * Terms and Conditions Form Component
 * 
 * Manages the editing of website terms and conditions
 * Follows SOLID principles with separated concerns
 */
export default function TermsConditionsForm() {
    const t = useTranslations("content-management-system.termsConditions.form");
    const { data, isLoading, updateTermsConditions, isUpdating } = 
        useTermsConditions(t);

    const form = useForm<TermsConditionsFormData>({
        resolver: zodResolver(createTermsConditionsFormSchema(t)),
        defaultValues: getDefaultTermsConditionsFormValues(),
    });

    const { control, handleSubmit, reset, formState: { errors } } = form;

    // Display validation errors as toasts
    useFormErrorToast(errors);

    // Load existing data into form
    useEffect(() => {
        if (data?.content) {
            reset({ content: data.content });
        }
    }, [data, reset]);

    const onSubmit = (formData: TermsConditionsFormData) => {
        updateTermsConditions({ content: formData.content });
    };

    if (isLoading) return <LoadingState />;

    return (
        <div className="px-6 py-4">
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <TermsConditionsEditor
                        control={control}
                        placeholder={t("contentPlaceholder") || "أدخل محتوى الشروط والاحكام هنا..."}
                    />
                    <SubmitButton
                        isUpdating={isUpdating}
                        label={t("saveChanges") || "حفظ التعديل"}
                    />
                </form>
            </Form>
        </div>
    );
}
