"use client";

import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
import { Loader2, Plus, Trash2 } from "lucide-react";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import ImageUpload from "@/components/shared/ImageUpload";
import FileUploadButton from "@/components/shared/FileUploadButton";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
    createAboutSettingFormSchema,
    AboutSettingFormData,
    getDefaultAboutSettingFormValues,
} from "../schema/about-setting-form.schema";

// About Us icons options
const ABOUT_US_ICONS_OPTIONS = [
    { value: "companies", label: "الشركات" },
    { value: "accreditations", label: "الاعتمادات" },
    { value: "certificates", label: "الشهادات" },
];

export default function AboutSettingForm() {
    const t = useTranslations("content-management-system.aboutSetting.form");

    const form = useForm<AboutSettingFormData>({
        resolver: zodResolver(createAboutSettingFormSchema(t)),
        defaultValues: getDefaultAboutSettingFormValues(),
    });

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = form;

    // Project types array
    const {
        fields: projectTypeFields,
        append: appendProjectType,
        remove: removeProjectType,
    } = useFieldArray({
        control,
        name: "project_types",
    });

    // Attachments array
    const {
        fields: attachmentFields,
        append: appendAttachment,
        remove: removeAttachment,
    } = useFieldArray({
        control,
        name: "attachments",
    });

    // Show toast for validation errors
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];
            if (firstError?.message) {
                toast.error(firstError.message as string);
            }
        }
    }, [errors]);

    const onSubmit = async (data: AboutSettingFormData) => {
        try {
            // TODO: Replace with actual API call
            // await AboutSettingApi.update(data);
            toast.success(t("updateSuccess") || "Settings updated successfully!");
        } catch (error: unknown) {
            console.error("Error updating settings:", error);

            if (error && typeof error === 'object' && 'response' in error) {
                const apiError = error as { response?: { status?: number; data?: { errors?: Record<string, string[]> } } };
                if (apiError.response?.status === 422) {
                    const validationErrors = apiError.response?.data?.errors;
                    if (validationErrors) {
                        const firstErrorKey = Object.keys(validationErrors)[0];
                        const firstErrorMessage = validationErrors[firstErrorKey][0];
                        toast.error(firstErrorMessage || t("validationError"));
                        return;
                    }
                }
            }

            toast.error(
                t("updateError") || "Failed to update settings. Please try again."
            );
        }
    };

    const handleAddProjectType = () => {
        appendProjectType({
            name_ar: "",
            name_en: "",
            projects_count: 0,
        });
    };

    const handleAddAttachment = () => {
        appendAttachment({
            file_name: "",
            file: null,
        });
    };

    return (
        <div className="px-6 py-4">
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Main Section */}
                    <div className="bg-sidebar rounded-lg p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-white">
                            {t("mainSection") || "القسم الرئيسي"}
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                            {/* 20% width - Section Image */}
                            <div className="lg:col-span-1">
                                <FormField
                                    control={control}
                                    name="section_image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">
                                                {t("sectionImage") || "صورة القسم"}
                                            </FormLabel>
                                            <FormControl>
                                                <ImageUpload
                                                    label=""
                                                    maxSize="3MB - الحجم الأقصى"
                                                    dimensions="2160 × 2160"
                                                    required={false}
                                                    onChange={(file) => field.onChange(file)}
                                                    initialValue={undefined}
                                                    minHeight="200px"
                                                    className="mt-1"
                                                    accept="image/*"
                                                />
                                            </FormControl>
                                            <FormErrorMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* 80% width - Title & Description */}
                            <div className="lg:col-span-4 space-y-4">
                                {/* Title */}
                                <FormField
                                    control={control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">
                                                {t("title") || "العنوان"}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    variant="secondary"
                                                    disabled={isSubmitting}
                                                    className="mt-1"
                                                    placeholder={t("titlePlaceholder") || "Enter title"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormErrorMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Description */}
                                <FormField
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">
                                                {t("description") || "الوصف"}
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    disabled={isSubmitting}
                                                    rows={6}
                                                    className="mt-1 resize-none bg-sidebar border-white text-white"
                                                    placeholder={t("descriptionPlaceholder") || "Enter description"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormErrorMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Page Sections */}
                    <div className="bg-sidebar rounded-lg p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-white">
                            {t("pageSections") || "اقسام الصفحة"}
                        </h2>

                        {/* About Us Icons */}
                        <FormField
                            control={control}
                            name="about_us_icons"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormLabel className="text-2xs pt-2" required>
                                        {t("aboutUsIcons") || "أيقونات من نحن"}
                                    </FormLabel>
                                    <FormControl>
                                        <Controller
                                            control={control}
                                            name="about_us_icons"
                                            render={({ field: controllerField }) => (
                                                <div className="flex flex-wrap gap-4 mt-2">
                                                    {ABOUT_US_ICONS_OPTIONS.map((option) => {
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
                                                                <span className="text-sm font-medium select-none transition-colors">
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

                        {/* About Us Arabic */}
                        <FormField
                            control={control}
                            name="about_us_ar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">
                                        {t("aboutUsAr") || "نبذة عنا عربي"}
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            rows={6}
                                            className="mt-1 resize-none bg-sidebar border-white text-white"
                                            placeholder={t("aboutUsArPlaceholder") || "Enter about us in Arabic"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormErrorMessage />
                                </FormItem>
                            )}
                        />

                        {/* About Us English */}
                        <FormField
                            control={control}
                            name="about_us_en"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">
                                        {t("aboutUsEn") || "نبذة عنا الانجليزية"}
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            rows={6}
                                            className="mt-1 resize-none bg-sidebar border-white text-white"
                                            placeholder={t("aboutUsEnPlaceholder") || "Enter about us in English"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormErrorMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Vision Arabic */}
                            <FormField
                                control={control}
                                name="vision_ar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">
                                            {t("visionAr") || "الرؤية عربي"}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                variant="secondary"
                                                disabled={isSubmitting}
                                                className="mt-1"
                                                placeholder={t("visionArPlaceholder") || "Enter vision in Arabic"}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormErrorMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Vision English */}
                            <FormField
                                control={control}
                                name="vision_en"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">
                                            {t("visionEn") || "الرؤية الانجليزية"}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                variant="secondary"
                                                disabled={isSubmitting}
                                                className="mt-1"
                                                placeholder={t("visionEnPlaceholder") || "Enter vision in English"}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormErrorMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Company Goal Arabic */}
                            <FormField
                                control={control}
                                name="company_goal_ar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">
                                            {t("companyGoalAr") || "هدف الشركة عربي"}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                variant="secondary"
                                                disabled={isSubmitting}
                                                className="mt-1"
                                                placeholder={t("companyGoalArPlaceholder") || "Enter company goal in Arabic"}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormErrorMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Company Goal English */}
                            <FormField
                                control={control}
                                name="company_goal_en"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">
                                            {t("companyGoalEn") || "هدف الشركة الانجليزية"}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                variant="secondary"
                                                disabled={isSubmitting}
                                                className="mt-1"
                                                placeholder={t("companyGoalEnPlaceholder") || "Enter company goal in English"}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormErrorMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Company Slogan Arabic */}
                        <FormField
                            control={control}
                            name="company_slogan_ar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">
                                        {t("companySloganAr") || "شعار الشركة عربي"}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            variant="secondary"
                                            disabled={isSubmitting}
                                            className="mt-1"
                                            placeholder={t("companySloganArPlaceholder") || "Enter company slogan in Arabic"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormErrorMessage />
                                </FormItem>
                            )}
                        />

                        {/* Company Slogan English */}
                        <FormField
                            control={control}
                            name="company_slogan_en"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">
                                        {t("companySloganEn") || "شعار الشركة الانجليزية"}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            variant="secondary"
                                            disabled={isSubmitting}
                                            className="mt-1"
                                            placeholder={t("companySloganEnPlaceholder") || "Enter company slogan in English"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormErrorMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Project Types */}
                    <div className="bg-sidebar rounded-lg p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">
                                {t("projectTypes") || "نوع مشروع"}
                            </h2>
                            <Button
                                type="button"
                                onClick={handleAddProjectType}
                                disabled={isSubmitting}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                {t("addNewType") || "إضافة نوع جديد"}
                            </Button>
                        </div>

                        {projectTypeFields.map((field, index) => (
                            <div
                                key={field.id}
                                className="border rounded-lg p-4 space-y-4 bg-sidebar/50"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-semibold text-white">
                                        {t("projectType")} ({index + 1})
                                    </h4>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeProjectType(index)}
                                        disabled={isSubmitting}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    {/* Project Type Arabic */}
                                    <FormField
                                        control={control}
                                        name={`project_types.${index}.name_ar`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs" required>
                                                    {t("projectTypeAr") || "نوع المشروع عربي"}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        variant="secondary"
                                                        disabled={isSubmitting}
                                                        className="mt-1"
                                                        placeholder={t("projectTypeArPlaceholder") || "Enter project type in Arabic"}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormErrorMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Project Type English */}
                                    <FormField
                                        control={control}
                                        name={`project_types.${index}.name_en`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">
                                                    {t("projectTypeEn") || "نوع المشروع الانجليزية"}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        variant="secondary"
                                                        disabled={isSubmitting}
                                                        className="mt-1"
                                                        placeholder={t("projectTypeEnPlaceholder") || "Enter project type in English"}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormErrorMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Projects Count */}
                                    <FormField
                                        control={control}
                                        name={`project_types.${index}.projects_count`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs" required>
                                                    {t("projectsCount") || "عدد المشاريع"}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        variant="secondary"
                                                        disabled={isSubmitting}
                                                        className="mt-1"
                                                        placeholder={t("projectsCountPlaceholder") || "Enter number of projects"}
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        onChange={(e) => {
                                                            field.onChange(e.target.valueAsNumber || 0);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormErrorMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Attachments */}
                    <div className="bg-sidebar rounded-lg p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">
                                {t("attachments") || "المرفقات"}
                            </h2>
                            <Button
                                type="button"
                                onClick={handleAddAttachment}
                                disabled={isSubmitting}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                {t("addAttachment") || "إضافة مرفق"}
                            </Button>
                        </div>

                        {attachmentFields.map((field, index) => (
                            <div
                                key={field.id}
                                className="border rounded-lg p-4 space-y-4 bg-sidebar/50"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-semibold text-white">
                                        {t("attachment")} ({index + 1})
                                    </h4>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeAttachment(index)}
                                        disabled={isSubmitting}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    <FormLabel className="text-xs" required>
                                        {t("fileName") || "اسم الملف"}
                                    </FormLabel>
                                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
                                        {/* 80% width - File Name */}
                                        <div className="lg:col-span-4">
                                            <FormField
                                                control={control}
                                                name={`attachments.${index}.file_name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                variant="secondary"
                                                                disabled={isSubmitting}
                                                                className="mt-1"
                                                                placeholder={t("fileNamePlaceholder") || "Enter file name"}
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
                                                {t("canAttachPdfFile") || "يمكن أرفاق ملف PDF"}
                                            </p>
                                            <FormField
                                                control={control}
                                                name={`attachments.${index}.file`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <FileUploadButton
                                                                onChange={(file) => field.onChange(file)}
                                                                accept="application/pdf,.pdf"
                                                                maxSize="10MB"
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
                            </div>
                        ))}
                    </div>

                    {/* Save Button */}
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
                </form>
            </Form>
        </div>
    );
}
