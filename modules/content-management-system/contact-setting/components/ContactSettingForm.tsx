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
import CheckboxGroupField from "@/modules/form-builder/components/fields/CheckboxGroupField";
import ImageUpload from "@/components/shared/ImageUpload";
import { toast } from "sonner";
import {
    createContactSettingFormSchema,
    ContactSettingFormData,
    getDefaultContactSettingFormValues,
} from "../schema/contact-setting-form.schema";

// About Us icons options
const ABOUT_US_ICONS_OPTIONS = [
    { value: "companies", label: "الشركات" },
    { value: "accreditations", label: "الاعتمادات" },
    { value: "certificates", label: "الشهادات" },
];

export default function ContactSettingForm() {
    const t = useTranslations("content-management-system.contactSetting.form");

    const form = useForm<ContactSettingFormData>({
        resolver: zodResolver(createContactSettingFormSchema(t)),
        defaultValues: getDefaultContactSettingFormValues(),
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

    const onSubmit = async (data: ContactSettingFormData) => {
        try {
            // TODO: Replace with actual API call
            // await ContactSettingApi.update(data);
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

                        {/* Section Image */}
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
                                <FormItem>
                                    <FormLabel className="text-xs" required>
                                        {t("aboutUsIcons") || "أيقونات من نحن"}
                                    </FormLabel>
                                    <FormControl>
                                        <Controller
                                            control={control}
                                            name="about_us_icons"
                                            render={({ field: controllerField }) => (
                                                <CheckboxGroupField
                                                    field={{
                                                        name: "about_us_icons",
                                                        type: "checkboxGroup",
                                                        label: "",
                                                        isMulti: true,
                                                        options: ABOUT_US_ICONS_OPTIONS,
                                                    }}
                                                    value={controllerField.value || []}
                                                    onChange={controllerField.onChange}
                                                    onBlur={controllerField.onBlur}
                                                    error={errors.about_us_icons?.message as string}
                                                    touched={!!errors.about_us_icons}
                                                    isHorizontal={true}
                                                />
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
                                        <Textarea
                                            disabled={isSubmitting}
                                            rows={6}
                                            className="mt-1 resize-none bg-sidebar border-white text-white"
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
                                        <Textarea
                                            disabled={isSubmitting}
                                            rows={6}
                                            className="mt-1 resize-none bg-sidebar border-white text-white"
                                            placeholder={t("visionEnPlaceholder") || "Enter vision in English"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormErrorMessage />
                                </FormItem>
                            )}
                        />

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
                                        <Textarea
                                            disabled={isSubmitting}
                                            rows={6}
                                            className="mt-1 resize-none bg-sidebar border-white text-white"
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
                                        <Textarea
                                            disabled={isSubmitting}
                                            rows={6}
                                            className="mt-1 resize-none bg-sidebar border-white text-white"
                                            placeholder={t("companyGoalEnPlaceholder") || "Enter company goal in English"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormErrorMessage />
                                </FormItem>
                            )}
                        />

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
                                        <Textarea
                                            disabled={isSubmitting}
                                            rows={6}
                                            className="mt-1 resize-none bg-sidebar border-white text-white"
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
                                        <Textarea
                                            disabled={isSubmitting}
                                            rows={6}
                                            className="mt-1 resize-none bg-sidebar border-white text-white"
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
                                variant="outline"
                                onClick={handleAddProjectType}
                                disabled={isSubmitting}
                                className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                </div>

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
                                                        const value = e.target.value;
                                                        field.onChange(value === "" ? 0 : parseInt(value, 10));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormErrorMessage />
                                        </FormItem>
                                    )}
                                />
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
                                variant="outline"
                                onClick={handleAddAttachment}
                                disabled={isSubmitting}
                                className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
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

                                {/* File Name */}
                                <FormField
                                    control={control}
                                    name={`attachments.${index}.file_name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs" required>
                                                {t("fileName") || "اسم الملف"}
                                            </FormLabel>
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

                                {/* File Upload */}
                                <div className="flex items-center gap-3">
                                    <p className="text-xs text-gray-400">
                                        {t("canAttachPdfFile") || "يمكن أرفاق ملف PDF"}
                                    </p>
                                    <FormField
                                        control={control}
                                        name={`attachments.${index}.file`}
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
                                                        accept="application/pdf"
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
