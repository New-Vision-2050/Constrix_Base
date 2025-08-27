"use client";

import React from "react";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

const createWarehouse2Schema = () =>
  z.object({
    warehouseName: z
      .string()
      .min(1, "اسم المخزن مطلوب")
      .min(2, "اسم المخزن يجب أن يكون على الأقل حرفين"),
    virtualLocationEnabled: z.boolean().default(false),
    country: z.string().min(1, "الدولة مطلوبة"),
    city: z.string().min(1, "المدينة مطلوبة"),
    latitude: z
      .string()
      .min(1, "خط العرض مطلوب")
      .refine(
        (val) => {
          const num = Number(val);
          return !isNaN(num) && num >= -90 && num <= 90;
        },
        { message: "خط العرض يجب أن يكون بين -90 و 90" }
      ),
    longitude: z
      .string()
      .min(1, "خط الطول مطلوب")
      .refine(
        (val) => {
          const num = Number(val);
          return !isNaN(num) && num >= -180 && num <= 180;
        },
        { message: "خط الطول يجب أن يكون بين -180 و 180" }
      ),
    street: z.string().min(1, "الشارع مطلوب"),
    location: z.string().min(1, "الموقع مطلوب"),
  });

type Warehouse2FormData = z.infer<ReturnType<typeof createWarehouse2Schema>>;

interface Warehouse2Data {
  warehouse_name: string;
  virtual_location_enabled: boolean;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  street: string;
  location: string;
}

interface AddWarehouse2DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: Warehouse2Data) => void;
}

export default function AddWarehouse2Dialog({
  isOpen,
  onClose,
  onSuccess,
}: AddWarehouse2DialogProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Warehouse2FormData>({
    resolver: zodResolver(createWarehouse2Schema()),
    defaultValues: {
      warehouseName: "",
      virtualLocationEnabled: false,
      country: "",
      city: "",
      latitude: "",
      longitude: "",
      street: "",
      location: "",
    },
  });

  const watchedVirtualLocationEnabled = watch("virtualLocationEnabled");

  const onSubmit = async (data: Warehouse2FormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const submitData: Warehouse2Data = {
        warehouse_name: data.warehouseName,
        virtual_location_enabled: data.virtualLocationEnabled,
        country: data.country,
        city: data.city,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        street: data.street,
        location: data.location,
      };

      console.log("Submitting warehouse 2 data:", submitData);

      onSuccess?.(submitData);

      reset();
      onClose();
    } catch (error) {
      console.error("Error creating warehouse 2:", error);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={`max-w-5xl w-full bg-sidebar border-gray-700 ${
          isRtl ? "rtl" : "ltr"
        }`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            اضافة مخزن
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label
                  htmlFor="warehouseName"
                  className="text-sm text-gray-400"
                >
                  اسم المخزن
                </Label>
                <Input
                  id="warehouseName"
                  variant="secondary"
                  {...register("warehouseName")}
                  placeholder="مخزن بحري"
                  disabled={isSubmitting}
                />
                {errors.warehouseName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.warehouseName.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 space-x-reverse mr-8">
                <Switch
                  id="virtualLocationEnabled"
                  checked={watchedVirtualLocationEnabled}
                  onCheckedChange={(checked) =>
                    setValue("virtualLocationEnabled", checked)
                  }
                  disabled={isSubmitting}
                />
                <Label
                  htmlFor="virtualLocationEnabled"
                  className="text-sm font-medium cursor-pointer text-white"
                >
                  تفعيل الموقع الافتراضي
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm text-gray-400">
                      الدولة
                    </Label>
                    <select
                      id="country"
                      {...register("country")}
                      className="w-full p-3 bg-sidebar border border-gray-700 rounded-md text-white"
                      disabled={isSubmitting}
                    >
                      <option value="">اختر الدولة</option>
                      <option value="مصر">مصر</option>
                      <option value="السعودية">السعودية</option>
                      <option value="الإمارات">الإمارات</option>
                    </select>
                    {errors.country && (
                      <p className="text-red-500 text-sm">
                        {errors.country.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm text-gray-400">
                      المدينة
                    </Label>
                    <select
                      id="city"
                      {...register("city")}
                      className="w-full p-3 bg-sidebar border border-gray-700 rounded-md text-white"
                      disabled={isSubmitting}
                    >
                      <option value="">اختر المدينة</option>
                      <option value="الاسكندرية">الاسكندرية</option>
                      <option value="القاهرة">القاهرة</option>
                      <option value="الرياض">الرياض</option>
                    </select>
                    {errors.city && (
                      <p className="text-red-500 text-sm">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude" className="text-sm text-gray-400">
                      خط العرض
                    </Label>
                    <Input
                      id="latitude"
                      variant="secondary"
                      type="number"
                      {...register("latitude")}
                      placeholder="25.3253.486.4786.1"
                      disabled={isSubmitting}
                      step="any"
                    />
                    {errors.latitude && (
                      <p className="text-red-500 text-sm">
                        {errors.latitude.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="longitude"
                      className="text-sm text-gray-400"
                    >
                      خط الطول
                    </Label>
                    <Input
                      id="longitude"
                      variant="secondary"
                      type="number"
                      {...register("longitude")}
                      placeholder="25.3253.486.4786.1"
                      disabled={isSubmitting}
                      step="any"
                    />
                    {errors.longitude && (
                      <p className="text-red-500 text-sm">
                        {errors.longitude.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street" className="text-sm text-gray-400">
                      الشارع
                    </Label>
                    <Input
                      id="street"
                      variant="secondary"
                      {...register("street")}
                      placeholder="25.3253.486.4786.1"
                      disabled={isSubmitting}
                    />
                    {errors.street && (
                      <p className="text-red-500 text-sm">
                        {errors.street.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm text-gray-400">
                      الموقع
                    </Label>
                    <Input
                      id="location"
                      variant="secondary"
                      {...register("location")}
                      placeholder="25.3253.486.4786.1"
                      disabled={isSubmitting}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm">
                        {errors.location.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
                <div className="relative z-10 text-gray-600 text-center">
                  <div className="text-2xl mb-2">🗺️</div>
                  <div className="text-sm">خريطة الموقع</div>
                  <div className="text-xs text-gray-500 mt-1">
                    سيتم عرض الموقع هنا
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                    📍
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              الغاء
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  جاري الحفظ...
                </span>
              ) : (
                "حفظ"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
