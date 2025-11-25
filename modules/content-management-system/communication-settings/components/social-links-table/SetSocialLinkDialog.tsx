"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormControl } from "@/modules/table/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import ImageUpload from "@/components/shared/ImageUpload";
import { toast } from "sonner";
import { CommunicationSettingsSocialLinksApi } from "@/services/api/company-dashboard/communication-settings";
import {
    socialLinkSchema,
    SocialLinkFormData,
    socialLinkDefaultValues,
    SOCIAL_LINK_TYPE_LABELS,
    SocialLinkTypeEnum
} from "../../schema/social-link.schema";

interface SetSocialLinkDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    socialLinkId?: string;
}

export default function SetSocialLinkDialog({
    open,
    onClose,
    onSuccess,
    socialLinkId
}: SetSocialLinkDialogProps) {
    const t = useTranslations("content-management-system.communicationSetting.socialLinksTable");
    const isEditMode = !!socialLinkId;

    const { data: socialLinkData, isLoading } = useQuery({
        queryKey: ["cms-social-link", socialLinkId],
        queryFn: () => CommunicationSettingsSocialLinksApi.show(socialLinkId!),
        enabled: isEditMode && open,
    });

    const form = useForm<SocialLinkFormData>({
        resolver: zodResolver(socialLinkSchema),
        defaultValues: socialLinkDefaultValues,
    });

    const { control, handleSubmit, setValue, reset, formState: { isSubmitting } } = form;

    useEffect(() => {
        if (isEditMode && socialLinkData?.data?.payload) {
            const { type, url } = socialLinkData.data.payload;
            setValue("type", type);
            setValue("url", url);
            // social_icon is handled by ImageUpload component via initialValue
        }
    }, [isEditMode, socialLinkData, setValue]);

    const onSubmit = async (data: SocialLinkFormData) => {
        try {
            isEditMode
                ? await CommunicationSettingsSocialLinksApi.update(socialLinkId!, data)
                : await CommunicationSettingsSocialLinksApi.create(data);
            toast.success(isEditMode ? t("updateSuccess") : t("createSuccess"));
            onSuccess?.();
            reset();
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t("operationFailed"));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl bg-sidebar border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {isEditMode ? t("editTitle") : t("addTitle")}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                            {/* 30% width - Social Icon */}
                            <div className="lg:col-span-2">
                                <FormField control={control} name="social_icon" render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <ImageUpload
                                                label={t("iconLabel") || "Social Icon"}
                                                maxSize="5MB - Max size"
                                                dimensions="512 x 512"
                                                required={true}
                                                onChange={(file) => field.onChange(file)}
                                                initialValue={
                                                    isEditMode && socialLinkData?.data?.payload?.social_icon
                                                        ? socialLinkData.data.payload.social_icon
                                                        : undefined
                                                }
                                                minHeight="150px"
                                                className="mt-1"
                                            />
                                        </FormControl>
                                        <FormErrorMessage />
                                    </FormItem>
                                )} />
                            </div>
                            {/* 70% width - Type & URL */}
                            <div className="lg:col-span-3 space-y-4">
                                {/* Type */}
                                <FormField control={control} name="type" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required>{t("typeLabel")}</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting || isLoading}>
                                            <FormControl>
                                                <SelectTrigger className="bg-background">
                                                    <SelectValue placeholder={t("typePlaceholder")} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {SocialLinkTypeEnum.options.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {SOCIAL_LINK_TYPE_LABELS[type]}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormErrorMessage />
                                    </FormItem>
                                )} />
                                {/* URL */}
                                <FormField control={control} name="url" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required>{t("urlLabel")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                variant="secondary"
                                                placeholder="https://example.com"
                                                disabled={isSubmitting || isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormErrorMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="w-full bg-gradient-to-r from-pink-500 to-pink-600"
                        >
                            {(isSubmitting || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t("saveButton")}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

