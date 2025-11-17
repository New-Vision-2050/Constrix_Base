"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/modules/table/components/ui/textarea";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
} from "@/modules/table/components/ui/form";
import { Loader2 } from "lucide-react";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import CheckboxGroupField from "@/modules/form-builder/components/fields/CheckboxGroupField";
import ImageUpload from "@/components/shared/ImageUpload";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { toast } from "sonner";
import {
    createMainSettingsFormSchema,
    MainSettingsFormData,
    getDefaultMainSettingsFormValues,
} from "../schema/main-settings-form.schema";

// Homepage icons options
const HOMEPAGE_ICONS_OPTIONS = [
    { value: "companies", label: "الشركات" },
    { value: "accreditations", label: "الاعتمادات" },
    { value: "certificates", label: "الشهادات" },
];

export default function MainSettingsForm() {
    const isRtl = useIsRtl();
    const t = useTranslations("content-management-system.mainSettings.form");

    const form = useForm<MainSettingsFormData>({
        resolver: zodResolver(createMainSettingsFormSchema(t)),
        defaultValues: getDefaultMainSettingsFormValues(),
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

    const onSubmit = async (data: MainSettingsFormData) => {
        try {
            // TODO: Replace with actual API call
            // await MainSettingsApi.update(data);
            toast.success(t("updateSuccess") || "Settings updated successfully!");
        } catch (error: any) {
            console.error("Error updating settings:", error);

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
                t("updateError") || "Failed to update settings. Please try again."
            );
        }
    };

    return (
        <div className="px-6 py-4">
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Main Section */}
                    <div className="bg-sidebar rounded-lg p-6 space-y-6 border-b border-gray-700 pb-6">
                        <h2 className="text-lg font-semibold text-white">
                            {t("mainSection") || "القسم الرئيسي"}
                        </h2>

                        {/* Web Video Link */}
                        <FormField
                            control={control}
                            name="video_link_web"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">
                                        {t("videoLinkWeb") ||
                                            "رابط الفيديو (الوضع الافتراضي الويب)"}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            variant="secondary"
                                            disabled={isSubmitting}
                                            className="mt-1"
                                            placeholder={t("videoLinkWebPlaceholder") || "Enter video URL"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormErrorMessage />
                                </FormItem>
                            )}
                        />
                        {/* Mobile Video Link */}
                        <FormField
                            control={control}
                            name="video_link_mobile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">
                                        {t("videoLinkMobile") || "رابط الفيديو (وضع الجوال)"}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            variant="secondary"
                                            disabled={isSubmitting}
                                            className="mt-1"
                                            placeholder={t("videoLinkMobilePlaceholder") || "Enter video URL"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormErrorMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-xs text-gray-400">
                                    {t("canAttachVideoInstead") ||
                                        "يمكن أرفاق فيديو بدلا من استخدام الرابط"}
                                </p>
                                <FormField
                                    control={control}
                                    name="video_file_web"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <ImageUpload
                                                    label=""
                                                    maxSize="100MB - الحجم الأقصى"
                                                    dimensions=""
                                                    required={false}
                                                    onChange={(file) => field.onChange(file)}
                                                    initialValue={undefined}
                                                    minHeight="100px"
                                                    className="mt-1"
                                                    accept="video/mp4,video/webm,video/ogg"
                                                />
                                            </FormControl>
                                            <FormErrorMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-xs text-gray-400">
                                    {t("canAttachVideoInstead") ||
                                        "يمكن أرفاق فيديو بدلا من استخدام الرابط"}
                                </p>
                                <FormField
                                    control={control}
                                    name="video_file_mobile"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <ImageUpload
                                                    label=""
                                                    maxSize="100MB - الحجم الأقصى"
                                                    dimensions=""
                                                    required={false}
                                                    onChange={(file) => field.onChange(file)}
                                                    initialValue={undefined}
                                                    minHeight="100px"
                                                    className="mt-1"
                                                    accept="video/mp4,video/webm,video/ogg"
                                                />
                                            </FormControl>
                                            <FormErrorMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Description Arabic */}
                        <FormField
                            control={control}
                            name="description_ar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs" required>
                                        {t("descriptionAr") ||
                                            "وصف الشريحة الرئيسية عربي (زر المزيد)"}
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            rows={6}
                                            className="mt-1 resize-none bg-sidebar border-white text-white"
                                            placeholder={t("descriptionArPlaceholder") || "Enter description"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormErrorMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description English */}
                        <FormField
                            control={control}
                            name="description_en"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs" required>
                                        {t("descriptionEn") ||
                                            "وصف الشريحة الرئيسية الانجليزية (زر المزيد)"}
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            rows={6}
                                            className="mt-1 resize-none bg-sidebar border-white text-white"
                                            placeholder={t("descriptionEnPlaceholder") || "Enter description"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormErrorMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Page Sections */}
                    <div className="bg-sidebar rounded-lg p-6 space-y-6 border-b border-gray-700 pb-6">
                        <h2 className="text-lg font-semibold text-white">
                            {t("pageSections") || "اقسام الصفحة"}
                        </h2>

                        {/* Homepage Icons */}
                        <FormField
                            control={control}
                            name="homepage_icons"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs" required>
                                        {t("homepageIcons") || "أيقونات الصفحة الرئيسية"}
                                    </FormLabel>
                                    <FormControl>
                                        <Controller
                                            control={control}
                                            name="homepage_icons"
                                            render={({ field: controllerField }) => (
                                                <CheckboxGroupField
                                                    field={{
                                                        name: "homepage_icons",
                                                        type: "checkboxGroup",
                                                        label: "",
                                                        isMulti: true,
                                                        options: HOMEPAGE_ICONS_OPTIONS,
                                                    }}
                                                    value={controllerField.value || []}
                                                    onChange={controllerField.onChange}
                                                    onBlur={controllerField.onBlur}
                                                    error={errors.homepage_icons?.message as string}
                                                    touched={!!errors.homepage_icons}
                                                    isHorizontal={true}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                    <FormErrorMessage />
                                </FormItem>
                            )}
                        />

                        {/* Company Profile File */}
                        <FormField
                            control={control}
                            name="company_profile_file"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs" required>
                                        {t("companyProfile") || "الملف التعريفي للشركة"}
                                    </FormLabel>
                                    <div className="flex gap-3 mt-1">
                                        <p className="text-xs text-gray-400">
                                            {t("canAttachFileInstead") ||
                                                "يمكن أرفاق ملف بدلا من استخدام الرابط"}
                                        </p>
                                        <FormField
                                            control={control}
                                            name="company_profile_file"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <ImageUpload
                                                            label=""
                                                            maxSize="10MB - الحجم الأقصى"
                                                            dimensions=""
                                                            required={false}
                                                            onChange={(file) => field.onChange(file)}
                                                            initialValue={undefined}
                                                            minHeight="100px"
                                                            className="mt-1"
                                                            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                        />
                                                    </FormControl>
                                                    <FormErrorMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
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
