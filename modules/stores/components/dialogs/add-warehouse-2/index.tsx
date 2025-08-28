"use client";

import React, { useState, useEffect } from "react";
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
import { useIsRtl } from "@/hooks/use-is-rtl";
import PlacesPicker, {
  GoogleMapPickerValue,
} from "@/components/headless/places-picker";
import { WarehousesApi } from "@/services/api/ecommerce/warehouses";
import { CreateWarehouseParams } from "@/services/api/ecommerce/warehouses/types/params";
import { baseApi } from "@/config/axios/instances/base";
import { API_Country } from "@/types/api/shared/country";
import { API_City } from "@/types/api/shared/city";

const createWarehouse2Schema = () =>
  z.object({
    name: z
      .string()
      .min(1, "اسم المخزن مطلوب")
      .min(2, "اسم المخزن يجب أن يكون على الأقل حرفين"),
    is_default: z.boolean().default(false),
    country_id: z.number().min(1, "الدولة مطلوبة"),
    city_id: z.number().min(1, "المدينة مطلوبة"),
    district: z.string().min(1, "المنطقة مطلوبة"),
    street: z.string().min(1, "الشارع مطلوب"),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  });

type Warehouse2FormData = z.infer<ReturnType<typeof createWarehouse2Schema>>;

interface AddWarehouse2DialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddWarehouse2Dialog({
  open,
  onClose,
  onSuccess,
}: AddWarehouse2DialogProps) {
  const isRtl = useIsRtl();
  const [countries, setCountries] = useState<API_Country[]>([]);
  const [cities, setCities] = useState<API_City[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<GoogleMapPickerValue | null>(null);

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
      name: "",
      is_default: false,
      country_id: 0,
      city_id: 0,
      district: "",
      street: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const watchedIsDefault = watch("is_default");

  // Load countries and cities on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load countries
        const countriesResponse = await baseApi.get<{
          code: string;
          message: string;
          payload: API_Country[];
        }>("/countries");
        setCountries(countriesResponse.data.payload || []);

        // Load cities
        const citiesResponse = await baseApi.get<{
          code: string;
          message: string;
          payload: API_City[];
        }>("/countries/cities");
        setCities(citiesResponse.data.payload || []);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    if (open) {
      loadData();
    }
  }, [open]);

  // Handle location selection from map
  const handleLocationPick = (location: GoogleMapPickerValue) => {
    setSelectedLocation(location);
    if (location.lat && location.lng) {
      setValue("latitude", location.lat);
      setValue("longitude", location.lng);
    }
    if (location.address) {
      // Try to extract district from address
      const addressParts = location.address.split(",");
      if (addressParts.length > 1) {
        setValue("district", addressParts[1].trim());
      }
    }
  };

  const onSubmit = async (data: Warehouse2FormData) => {
    try {
      const createParams: CreateWarehouseParams = {
        name: data.name,
        is_default: data.is_default,
        country_id: data.country_id,
        city_id: data.city_id,
        district: data.district,
        street: data.street,
        latitude: data.latitude,
        longitude: data.longitude,
      };

      await WarehousesApi.create(createParams);

      onSuccess?.();
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating warehouse:", error);
      // You might want to add toast notification here
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
                <Label htmlFor="name" className="text-sm text-gray-400">
                  اسم المخزن
                </Label>
                <Input
                  id="name"
                  variant="secondary"
                  {...register("name")}
                  placeholder="مخزن بحري"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 space-x-reverse mr-8">
                <Switch
                  id="is_default"
                  checked={watchedIsDefault}
                  onCheckedChange={(checked) => setValue("is_default", checked)}
                  disabled={isSubmitting}
                />
                <Label
                  htmlFor="is_default"
                  className="text-sm font-medium cursor-pointer text-white"
                >
                  مخزن افتراضي
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="country_id"
                      className="text-sm text-gray-400"
                    >
                      الدولة
                    </Label>
                    <select
                      id="country_id"
                      {...register("country_id", { valueAsNumber: true })}
                      className="w-full p-3 bg-sidebar border border-gray-700 rounded-md text-white"
                      disabled={isSubmitting}
                    >
                      <option value={0}>اختر الدولة</option>
                      {countries.map((country) => (
                        <option key={country.id} value={Number(country.id)}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    {errors.country_id && (
                      <p className="text-red-500 text-sm">
                        {errors.country_id.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city_id" className="text-sm text-gray-400">
                      المدينة
                    </Label>
                    <select
                      id="city_id"
                      {...register("city_id", { valueAsNumber: true })}
                      className="w-full p-3 bg-sidebar border border-gray-700 rounded-md text-white"
                      disabled={isSubmitting}
                    >
                      <option value={0}>اختر المدينة</option>
                      {cities.map((city) => (
                        <option key={city.id} value={Number(city.id)}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    {errors.city_id && (
                      <p className="text-red-500 text-sm">
                        {errors.city_id.message}
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
                      {...register("latitude", { valueAsNumber: true })}
                      placeholder="25.325348647861"
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
                      {...register("longitude", { valueAsNumber: true })}
                      placeholder="55.296249647861"
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
                      placeholder="شارع الملك فهد"
                      disabled={isSubmitting}
                    />
                    {errors.street && (
                      <p className="text-red-500 text-sm">
                        {errors.street.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-sm text-gray-400">
                      المنطقة
                    </Label>
                    <Input
                      id="district"
                      variant="secondary"
                      {...register("district")}
                      placeholder="الرياض"
                      disabled={isSubmitting}
                    />
                    {errors.district && (
                      <p className="text-red-500 text-sm">
                        {errors.district.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-400">خريطة الموقع</Label>
              <div className="bg-gray-200 rounded-lg overflow-hidden">
                <PlacesPicker
                  onPick={handleLocationPick}
                  mapProps={{
                    mapContainerStyle: { width: "100%", height: "320px" },
                  }}
                />
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
