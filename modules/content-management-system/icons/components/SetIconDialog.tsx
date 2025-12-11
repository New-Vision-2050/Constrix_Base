"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
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
import { useIsRtl } from "@/hooks/use-is-rtl";
import { CompanyDashboardCategoriesApi } from "@/services/api/company-dashboard/categories";
import { toast } from "sonner";
import {
    createIconFormSchema,
    IconFormData,
    getDefaultIconFormValues,
} from "../schema/icon-form.schema";
import { CompanyDashboardIconsApi } from "@/services/api/company-dashboard/icons";
import { apiClient, baseURL } from "@/config/axios-config";

interface SetIconDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    iconId?: string;
}

export default function SetIconDialog({
    open,
    onClose,
    onSuccess,
    iconId,
}: SetIconDialogProps) {
    const isRtl = useIsRtl();
    const t = useTranslations("content-management-system.icons.form");
    const isEditMode = !!iconId;

    // Fetch icon data when editing
    const { data: iconData, isLoading: isFetching,refetch } = useQuery<{
        data: { payload: { name_ar?: string; name_en?: string; website_icon_category_type?: string; icon?: string } | null };
    }>({
        queryKey: ["company-dashboard-icon", iconId],
        queryFn: async () => {
            // TODO: Replace with actual API call
            return CompanyDashboardIconsApi.show(iconId!);
        },
        enabled: isEditMode && open,
    });

    // Fetch categories for dropdown
    const { data: categoriesData } = useQuery({
        queryKey: ["company-dashboard-categories"],
        queryFn: async () => {
            const response = await apiClient.get(baseURL + '/website-icons/category-types');
            return response.data;
        },
        enabled: open,
    });

    const form = useForm<IconFormData>({
        resolver: zodResolver(createIconFormSchema(t)),
        defaultValues: getDefaultIconFormValues(),
    });

    const {
        control,
        handleSubmit,
        reset,
        setValue,
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

    // Populate form with icon data when editing
    useEffect(() => {
        if (isEditMode && iconData?.data?.payload) {
            const icon = iconData.data.payload;

            setValue("name_ar", icon.name_ar || "", {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
            });
            setValue("name_en", icon.name_en || "", {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
            });
            if (icon.website_icon_category_type) {
                setValue("category_id", icon.website_icon_category_type, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                });
            }
        }
    }, [isEditMode, iconData, open, setValue]);

    const onSubmit = async (data: IconFormData) => {
        try {
            // TODO: Replace with actual API calls
            if (isEditMode && iconId) {
                await CompanyDashboardIconsApi.update(iconId, {
                    name_ar: data.name_ar,
                    name_en: data.name_en,
                    website_icon_category_type: data.category_id,
                    icon: data.logo_image || undefined,
                });
                refetch();
                toast.success(
                    t("updateSuccess") || "Icon updated successfully!"
                );
            } else {
                if (!data.logo_image) {
                    toast.error(t("logoImageRequired") || "Logo image is required");
                    return;
                }
                await CompanyDashboardIconsApi.create({
                    name_ar: data.name_ar,
                    name_en: data.name_en,
                    website_icon_category_type: data.category_id,
                    icon: data.logo_image,
                });
                toast.success(
                    t("createSuccess") || "Icon created successfully!"
                );
            }

            onSuccess?.();
            reset();
            onClose();
        } catch (error: any) {
            console.error(
                `Error ${isEditMode ? "updating" : "creating"} icon:`,
                error
            );

            // Handle 422 validation errors from server
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
                isEditMode
                    ? t("updateError") ||
                    "Failed to update icon. Please try again."
                    : t("createError") ||
                    "Failed to create icon. Please try again."
            );
        }
    };

    const handleClose = () => {
        if (!isSubmitting && !isFetching) {
            reset();
            onClose();
        }
    };

    // Get categories for dropdown
    const categories = categoriesData?.payload || [];

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent
                className={`max-w-4xl w-full bg-sidebar border-gray-700 p-4 sm:p-6 ${isRtl ? "rtl" : "ltr"
                    }`}
                dir={isRtl ? "rtl" : "ltr"}
            >
                <DialogHeader className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-0 top-0 text-white hover:bg-gray-700"
                        onClick={handleClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    <DialogTitle className="text-center text-lg font-semibold text-white">
                        {isEditMode ? t("editIcon") : t("addIcon")}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                            {/* Left Section - Image Upload (30%) */}
                            <div className="lg:col-span-3">
                                <FormField
                                    control={control}
                                    name="logo_image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <ImageUpload
                                                    label={t("logoImage") || "صورة الشعار"}
                                                    maxSize="3MB - الحجم الأقصى"
                                                    dimensions="2160 × 2160"
                                                    required={false}
                                                    onChange={(file) => field.onChange(file)}
                                                    initialValue={
                                                        isEditMode && iconData?.data?.payload?.icon
                                                            ? iconData.data.payload.icon
                                                            : undefined
                                                    }
                                                    minHeight="200px"
                                                    className="mt-1"
                                                />
                                            </FormControl>
                                            <FormErrorMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Right Section - Form Fields (70%) */}
                            <div className="lg:col-span-7 space-y-4">
                                {/* Icon Name Arabic */}
                                <FormField
                                    control={control}
                                    name="name_ar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs" required>
                                                {t("nameAr") || "إسم الأيقونة عربي"}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    variant="secondary"
                                                    disabled={isSubmitting || isFetching}
                                                    className="mt-1"
                                                    placeholder={t("nameArPlaceholder") || "أدخل إسم الأيقونة بالعربي"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormErrorMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Icon Name English */}
                                <FormField
                                    control={control}
                                    name="name_en"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs" required>
                                                {t("nameEn") || "إسم الأيقونة الانجليزية"}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    variant="secondary"
                                                    disabled={isSubmitting || isFetching}
                                                    className="mt-1"
                                                    placeholder={t("nameEnPlaceholder") || "Enter icon name in English"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormErrorMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <FormField
                            control={control}
                            name="category_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs" required>
                                        {t("category") || "الفئة"}
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={isSubmitting || isFetching}
                                        >
                                            <SelectTrigger
                                                className="mt-1 bg-sidebar border-white text-white h-12"
                                                showClear={!!field.value}
                                                onClear={() => field.onChange("")}
                                            >
                                                <SelectValue
                                                    placeholder={t("categoryPlaceholder") || "أختار الفئة"}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category: any) => (
                                                    <SelectItem key={category.id} value={category.id?.toString()}>
                                                        {category.name || category?.name_ar || category.id}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormErrorMessage />
                                </FormItem>
                            )}
                        />

                        {/* Save Button */}
                        <div className="mt-6">
                            <Button
                                type="submit"
                                disabled={isSubmitting || isFetching}
                                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
                            >
                                {(isSubmitting || isFetching) && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {t("save") || "حفظ"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
