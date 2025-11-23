"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Form } from "@/modules/table/components/ui/form";
import { createTermsConditionsFormSchema, TermsConditionsFormData, getDefaultTermsConditionsFormValues } from "../schema/terms-conditions-form.schema";
import { useUpdateTermsConditions } from "../hooks/useUpdateTermsConditions";
import { useFormErrorToast } from "../hooks/useFormErrorToast";
import TermsConditionsEditor from "./TermsConditionsEditor";
import SubmitButton from "./SubmitButton";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { TermsConditions } from "@/services/api/company-dashboard/terms-conditions/types/response";

interface TermsConditionsFormProps {
    initialData: TermsConditions | null;
}

/**
 * Terms and Conditions Form - manages editing with SOLID principles
 * Data is fetched server-side and passed via props
 */
export default function TermsConditionsForm({ initialData }: TermsConditionsFormProps) {
    const t = useTranslations("content-management-system.termsConditions.form");
    const { updateTermsConditions, isUpdating } = useUpdateTermsConditions(t);

    const form = useForm<TermsConditionsFormData>({
        resolver: zodResolver(createTermsConditionsFormSchema(t)),
        defaultValues: getDefaultTermsConditionsFormValues(),
    });

    const { control, handleSubmit, reset, formState: { errors } } = form;

    useFormErrorToast(errors);

    // Load initial data into form
    useEffect(() => {
        if (initialData?.content) {
            reset({ content: initialData.content });
        }
    }, [initialData, reset]);

    const onSubmit = (formData: TermsConditionsFormData) => 
        updateTermsConditions({ content: formData.content });

    return (
        <div className="px-6 py-4">
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <TermsConditionsEditor
                        control={control}
                        placeholder={t("contentPlaceholder") || "أدخل محتوى الشروط والاحكام هنا..."}
                    />
                    <Can check={[PERMISSIONS.CMS.termsConditions.update]}>
                        <SubmitButton
                            isUpdating={isUpdating}
                            label={t("saveChanges") || "حفظ التعديل"}
                        />
                    </Can>
                </form>
            </Form>
        </div>
    );
}
