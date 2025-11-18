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
import ImageUpload from "@/components/shared/ImageUpload";
import FileUploadButton from "@/components/shared/FileUploadButton";
import { Checkbox } from "@/components/ui/checkbox";
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

                        <div className="space-y-2">
                            <FormLabel className="text-xs">
                                {t("videoLinkWeb") ||
                                    "رابط الفيديو (الوضع الافتراضي الويب)"}
                            </FormLabel>
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
                                {/* 80% width - Web Video Link */}
                                <div className="lg:col-span-4">
                                    <FormField
                                        control={control}
                                        name="video_link_web"
                                        render={({ field }) => (
                                            <FormItem>
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
                                </div>
                                {/* 20% width - File Upload */}
                                <div className="lg:col-span-1 flex items-center gap-2">
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
                                                    <FileUploadButton
                                                        onChange={(file) => field.onChange(file)}
                                                        accept="video/mp4,video/webm,video/ogg"
                                                        maxSize="100MB"
                                                        initialValue={field.value}
                                                        disabled={isSubmitting}
                                                        className="mt-1"
                                                    />
                                                </FormControl>
                                                <FormErrorMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mobile Video Link */}
                        <div className="space-y-2">
                            <FormLabel className="text-xs">
                                {t("videoLinkMobile") || "رابط الفيديو (وضع الجوال)"}
                            </FormLabel>
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
                                {/* 80% width - Mobile Video Link */}
                                <div className="lg:col-span-4">
                                    <FormField
                                        control={control}
                                        name="video_link_mobile"
                                        render={({ field }) => (
                                            <FormItem>
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
                                </div>
                                {/* 20% width - File Upload */}
                                <div className="lg:col-span-1 flex items-center gap-2">
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
                                                    <FileUploadButton
                                                        onChange={(file) => field.onChange(file)}
                                                        accept="video/mp4,video/webm,video/ogg"
                                                        maxSize="100MB"
                                                        initialValue={field.value}
                                                        disabled={isSubmitting}
                                                        className="mt-1"
                                                    />
                                                </FormControl>
                                                <FormErrorMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
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
                                <FormItem className="flex items-center gap-2">
                                    <FormLabel className="text-2xs pt-2" required>
                                        {t("homepageIcons") || "أيقونات الصفحة الرئيسية"}
                                    </FormLabel>
                                    <FormControl>
                                        <Controller
                                            control={control}
                                            name="homepage_icons"
                                            render={({ field: controllerField }) => (
                                                <div className="flex flex-wrap gap-4 mt-2">
                                                    {HOMEPAGE_ICONS_OPTIONS.map((option) => {
                                                        const isChecked = (controllerField.value || []).includes(option.value);
                                                        return (
                                                            <label
                                                                key={option.value}
                                                                className="flex items-center gap-2 cursor-pointer group"
                                                            >
                                                                <Checkbox
                                                                    checked={isChecked}
                                                                    onCheckedChange={(checked) => {
                                                                        const currentValue = controllerField.value || [];
                                                                        if (checked) {
                                                                            controllerField.onChange([...currentValue, option.value]);
                                                                        } else {
                                                                            controllerField.onChange(
                                                                                currentValue.filter((v: string) => v !== option.value)
                                                                            );
                                                                        }
                                                                    }}
                                                                    onBlur={controllerField.onBlur}
                                                                    className="h-5 w-5 rounded border-2 border-gray-400 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500 data-[state=checked]:text-white"
                                                                />
                                                                <span className="text-sm font-medium select-none  transition-colors">
                                                                    {option.label}
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
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
                                    <div className="flex items-center justify-between gap-2 border rounded-lg border-gray-700 px-2">
                                        <p className="text-2xs">
                                            {t("canAttachFileInstead") ||
                                                "يمكن أرفاق ملف بدلا من استخدام الرابط"}
                                        </p>
                                        <div className="flex flex-col">

                                            <FormControl>
                                                <FileUploadButton
                                                    onChange={(file) => field.onChange(file)}
                                                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                    maxSize="10MB"
                                                    initialValue={field.value}
                                                    disabled={isSubmitting}
                                                    className="mt-1"
                                                />
                                            </FormControl>
                                            <FormErrorMessage />
                                        </div>
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
