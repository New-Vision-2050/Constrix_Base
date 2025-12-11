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
import { Loader2 } from "lucide-react";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { toast } from "sonner";
import { CommunicationSettingsAddressesApi } from "@/services/api/company-dashboard/communication-settings/addresses";
import { createAddressSchema, AddressFormValues, DEFAULT_ADDRESS_DATA } from "../../schema/address.schema";
import AddressMapComponent from "./AddressMapComponent";

interface SetAddressDialogProps {
    open: boolean; onClose: () => void; onSuccess?: () => void; addressId?: string;
}

export default function SetAddressDialog({ open, onClose, onSuccess, addressId }: SetAddressDialogProps) {
    const t = useTranslations("content-management-system.communicationSetting");
    const isEditMode = !!addressId;
    const { data: addressData, isLoading,refetch } = useQuery({
        queryKey: ["cms-address", addressId],
        queryFn: () => CommunicationSettingsAddressesApi.show(addressId!),
        enabled: isEditMode && open,
    });
    const form = useForm<AddressFormValues>({
        resolver: zodResolver(createAddressSchema(t)),
        defaultValues: DEFAULT_ADDRESS_DATA,
    });
    const { control, handleSubmit, setValue, watch, reset, formState: { isSubmitting } } = form;
    const [latitude, longitude] = watch(["latitude", "longitude"]);

    useEffect(() => {
        if (isEditMode && addressData?.data?.payload) {
            const { title_ar, title_en, address, latitude: lat, longitude: lng, status } = addressData.data.payload;
            setValue("title_ar", title_ar || "");
            setValue("title_en", title_en || "");
            setValue("address", address || "");
            setValue("latitude", lat?.toString() || "");
            setValue("longitude", lng?.toString() || "");
            setValue("status", status || 1);
        }
    }, [isEditMode, addressData, setValue]);

    const onSubmit = async (data: AddressFormValues) => {
        try {
            const payload = {
                title_ar: data.title_ar,
                title_en: data.title_en,
                address: data.address,
                latitude: parseFloat(data.latitude),
                longitude: parseFloat(data.longitude),
                status: data.status || 1,
                city_id: 1,
            };
            
            isEditMode 
                ? await CommunicationSettingsAddressesApi.update(addressId!, payload)
                : await CommunicationSettingsAddressesApi.create(payload);
            
            toast.success(isEditMode ? t("updateSuccess") : t("createSuccess"));
            onSuccess?.(); 
            reset();
            refetch();
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t("operationFailed"));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-sidebar border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {isEditMode ? t("table.editAddressTitle") : t("table.addAddressTitle")}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}><form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={control} name="title_ar" render={({ field }) => (
                            <FormItem><FormLabel required>{t("titleArLabel")}</FormLabel>
                                <FormControl><Input variant="secondary" disabled={isSubmitting || isLoading} placeholder={t("titleArPlaceholder")} {...field} /></FormControl>
                                <FormErrorMessage /></FormItem>)} />
                        <FormField control={control} name="title_en" render={({ field }) => (
                            <FormItem><FormLabel required>{t("titleEnLabel")}</FormLabel>
                                <FormControl><Input variant="secondary" disabled={isSubmitting || isLoading} placeholder={t("titleEnPlaceholder")} {...field} /></FormControl>
                                <FormErrorMessage /></FormItem>)} />
                    </div>
                    <FormField control={control} name="address" render={({ field }) => (
                        <FormItem><FormLabel required>{t("addressLabel")}</FormLabel>
                            <FormControl><Input variant="secondary" disabled={isSubmitting || isLoading} placeholder={t("addressPlaceholder")} {...field} /></FormControl>
                            <FormErrorMessage /></FormItem>)} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={control} name="latitude" render={({ field }) => (
                            <FormItem><FormLabel required>{t("latitudeLabel")}</FormLabel>
                                <FormControl><Input variant="secondary" disabled={isSubmitting || isLoading} {...field} /></FormControl>
                                <FormErrorMessage /></FormItem>)} />
                        <FormField control={control} name="longitude" render={({ field }) => (
                            <FormItem><FormLabel required>{t("longitudeLabel")}</FormLabel>
                                <FormControl><Input variant="secondary" disabled={isSubmitting || isLoading} {...field} /></FormControl>
                                <FormErrorMessage /></FormItem>)} />
                    </div>
                    <AddressMapComponent 
                        latitude={latitude} 
                        longitude={longitude}
                        onLocationSelect={(lat, lng) => { setValue("latitude", lat); setValue("longitude", lng); }}
                        disabled={isSubmitting || isLoading}
                    />
                    <Button type="submit" disabled={isSubmitting || isLoading}
                        className="w-full bg-gradient-to-r from-pink-500 to-pink-600">
                        {(isSubmitting || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t("saveButton")}
                    </Button>
                </form></Form>
            </DialogContent>
        </Dialog>
    );
}