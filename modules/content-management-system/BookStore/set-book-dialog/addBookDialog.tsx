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
import { Textarea } from "@/modules/table/components/ui/textarea";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
} from "@/modules/table/components/ui/form";
import { Loader2 } from "lucide-react";
import ImageUpload from "@/components/shared/ImageUpload";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { toast } from "sonner";
import { CompanyDashboardFoundersApi } from "@/services/api/company-dashboard/founders";
import {
    createFounderFormSchema,
    FounderFormData,
    getDefaultFounderFormValues,
} from "../schemas/founder-form.schema";
import { AddFounderDialogProps, AxiosError } from "../types";
import { ShowFounderResponse } from "@/services/api/company-dashboard/founders/types/response";
import { CreateFounderParams } from "@/services/api/company-dashboard/founders/types/params";

export default function AddFounderDialog({
                                             open,
                                             onClose,
                                             onSuccess,
                                             founderId,
                                         }: AddFounderDialogProps) {
    const t = useTranslations("content-management-system.founder");
    const tForm = useTranslations("content-management-system.founder.form");
    const isEditMode = !!founderId;

    // Fetch founder data when editing
    const { data: founderData, isLoading: isFetching } =
        useQuery<ShowFounderResponse>({
            queryKey: ["founder", founderId],
            queryFn: async () => {
                const response = await CompanyDashboardFoundersApi.show(founderId!);
                return response.data;
            },
            enabled: isEditMode && open && !!founderId,
        });

    const form = useForm({
        resolver: zodResolver(createFounderFormSchema(tForm, isEditMode)),
        defaultValues: getDefaultFounderFormValues(),
    });

    const {
        control,
        handleSubmit,
        reset,
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

    // Reset form to default values when opening Add dialog
    useEffect(() => {
        if (open && !isEditMode) {
            reset(getDefaultFounderFormValues());
        }
    }, [open, isEditMode, reset]);

    // Populate form with founder data when editing
    useEffect(() => {
        if (isEditMode && founderData?.payload) {
            const founder = founderData.payload;

            reset({
                name_ar: founder.name_ar || "",
                name_en: founder.name_en || "",
                job_title_ar: founder.job_title_ar || "",
                job_title_en: founder.job_title_en || "",
                description_ar: founder.description_ar || "",
                description_en: founder.description_en || "",
                profile_image: founder.personal_photo || null,
            });
        }
    }, [isEditMode, founderData, open, reset]);

    const onSubmit = async (data: FounderFormData) => {
        try {
            const params: CreateFounderParams = {
                name_ar: data.name_ar,
                name_en: data.name_en,
                job_title_ar: data.job_title_ar,
                job_title_en: data.job_title_en,
                description_ar: data.description_ar,
                description_en: data.description_en,
                personal_photo:
                    data.profile_image instanceof File ? data.profile_image : null,
            };

            if (isEditMode && founderId) {
                await CompanyDashboardFoundersApi.update(founderId, params);
            } else {
                await CompanyDashboardFoundersApi.create(params);
            }

            toast.success(
                isEditMode ? tForm("updateSuccess") : tForm("createSuccess")
            );
            onSuccess?.();
            reset();
            onClose();
        } catch (error) {
            console.error(
                `Error ${isEditMode ? "updating" : "creating"} founder:`,
                error
            );

            const axiosError = error as AxiosError;

            if (axiosError.response?.status === 422) {
                const validationErrors = axiosError.response.data?.errors;
                if (validationErrors) {
                    const firstErrorKey = Object.keys(validationErrors)[0];
                    const firstErrorMessage = validationErrors[firstErrorKey][0];
                    toast.error(firstErrorMessage || tForm("validationError"));
                    return;
                }
            }

            toast.error(isEditMode ? tForm("updateError") : tForm("createError"));
        }
    };

    const handleClose = () => {
        if (!isSubmitting && !isFetching) {
            reset();
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent
                className={`max-w-6xl w-full bg-sidebar max-h-[90vh] overflow-y-auto`}
            >
                <DialogHeader>
                    <DialogTitle className="text-center text-lg font-semibold">
                        {isEditMode
                            ? t("editFounder") || "Edit founder"
                            : t("addFounder") || "Add new founder"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Image Upload and Founder Names - 12 Column Grid */}
                        <div className="grid grid-cols-12 gap-4">
                            {/* Personal Photo - 3 columns */}
                            <div className="col-span-3">
                                <FormField
                                    control={control}
                                    name="profile_image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <ImageUpload
                                                    label={tForm("profileImage")}
                                                    maxSize={tForm("imageMaxSize")}
                                                    dimensions={tForm("imageDimensions")}
                                                    required={!isEditMode}
                                                    onChange={(file) => field.onChange(file)}
                                                    initialValue={
                                                        typeof field.value === "string"
                                                            ? field.value
                                                            : founderData?.payload?.personal_photo || null
                                                    }
                                                    minHeight="200px"
                                                />
                                            </FormControl>
                                            <FormErrorMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Founder Names - 9 columns */}
                            <div className="col-span-9 space-y-4">
                                <FormField
                                    control={control}
                                    name="name_ar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs " required>
                                                {tForm("nameAr")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    variant="secondary"
                                                    disabled={isSubmitting || isFetching}
                                                    className="mt-1 bg-sidebar  border-gray-700"
                                                    placeholder={tForm("nameArPlaceholder")}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormErrorMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="name_en"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs " required>
                                                {tForm("nameEn")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    variant="secondary"
                                                    disabled={isSubmitting || isFetching}
                                                    className="mt-1 bg-sidebar  border-gray-700"
                                                    placeholder={tForm("nameEnPlaceholder")}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormErrorMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Job Titles - 2 Column Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={control}
                                name="job_title_ar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs " required>
                                            {tForm("jobTitleAr")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                variant="secondary"
                                                disabled={isSubmitting || isFetching}
                                                className="mt-1 bg-sidebar  border-gray-700"
                                                placeholder={tForm("jobTitleArPlaceholder")}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormErrorMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="job_title_en"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs " required>
                                            {tForm("jobTitleEn")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                variant="secondary"
                                                disabled={isSubmitting || isFetching}
                                                className="mt-1 bg-sidebar  border-gray-700"
                                                placeholder={tForm("jobTitleEnPlaceholder")}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormErrorMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Founder Details */}
                        <div className="grid grid-cols-1 gap-4">
                            {/* Description Arabic */}
                            <FormField
                                control={control}
                                name="description_ar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs " required>
                                            {tForm("descriptionAr")}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                disabled={isSubmitting || isFetching}
                                                rows={6}
                                                className="mt-1 resize-none bg-sidebar  border-gray-700"
                                                placeholder={tForm("descriptionArPlaceholder")}
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
                                        <FormLabel className="text-xs " required>
                                            {tForm("descriptionEn")}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                disabled={isSubmitting || isFetching}
                                                rows={6}
                                                className="mt-1 resize-none bg-sidebar  border-gray-700"
                                                placeholder={tForm("descriptionEnPlaceholder")}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormErrorMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                            <Button
                                type="submit"
                                disabled={isSubmitting || isFetching}
                                className="w-full "
                            >
                                {(isSubmitting || isFetching) && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {tForm("save")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
