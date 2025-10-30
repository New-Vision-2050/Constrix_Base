"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import FormLabel from "@/components/shared/FormLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { toast } from "sonner";
import axios from "axios";
import { baseURL } from "@/config/axios-config";
import { Textarea } from "@/modules/table/components/ui/textarea";
import { getCountries } from "@/services/api/shared/countries";
import { ProductsApi } from "@/services/api/ecommerce/products";
import { PaymentMethodsApi } from "@/services/api/ecommerce/payment-methods";
import { RequestsApi } from "@/services/api/ecommerce/requests";
import RadioField from "@/modules/form-builder/components/fields/RadioField";

const createRequestSchema = (t: (key: string) => string) =>
  z.object({
    is_guest: z.enum(["existing", "guest"]),
    customer_id: z.string().optional(),
    customer_name: z.string().min(1, t("form.customerNameRequired")),
    customer_phone: z.string().min(1, t("form.customerPhoneRequired")),
    customer_email: z.string().email(t("form.customerEmailInvalid")),
    payment_method: z.string().min(1, t("form.paymentMethodRequired")),
    country: z.string().min(1, t("form.countryRequired")),
    shipping_address: z.string().min(1, t("form.shippingAddressRequired")),
    order_note: z.string().optional(),
    product_id: z.string().min(1, t("form.productRequired")),
    quantity: z.number().min(1, t("form.quantityRequired")),
  });

type RequestFormData = z.infer<ReturnType<typeof createRequestSchema>>;

interface AddRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddRequestDialog({
  open,
  onClose,
  onSuccess,
}: AddRequestDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations("requests");
  const tCommon = useTranslations("labels");
  const [customerType, setCustomerType] = useState<"existing" | "guest">(
    "existing"
  );

  // Fetch payment methods
  const { data: paymentMethodsData } = useQuery({
    queryKey: ["payment-methods-list"],
    queryFn: () => PaymentMethodsApi.list(),
    enabled: open,
  });

  // Fetch countries
  const { data: countriesData } = useQuery({
    queryKey: ["countries-list"],
    queryFn: () => getCountries(),
    enabled: open,
  });

  // Fetch products
  const { data: productsData } = useQuery({
    queryKey: ["products-list"],
    queryFn: () => ProductsApi.list(),
    enabled: open,
  });

  // Fetch customers (only when guest customer is selected)
  const { data: customersData } = useQuery({
    queryKey: ["customers-list"],
    queryFn: async () => {
      const response = await axios.get(
        `${baseURL}/ecommerce/dashboard/customers`
      );
      return response.data;
    },
    enabled: open && customerType === "guest",
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormData>({
    resolver: zodResolver(createRequestSchema(t)),
    defaultValues: {
      is_guest: "existing",
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      payment_method: "",
      country: "",
      shipping_address: "",
      order_note: "",
      product_id: "",
      quantity: 1,
    },
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

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      reset();
      setCustomerType("existing");
    }
  }, [open, reset]);

  const paymentMethods = paymentMethodsData?.data?.payload || [];
  const countries = countriesData?.data?.payload || [];
  // Handle both array and paginated response structures
  const productsPayload = productsData?.data?.payload;
  const products = Array.isArray(productsPayload)
    ? productsPayload
    : (productsPayload as any)?.data || [];
  const customers = customersData?.payload?.data || [];

  const onSubmit = async (data: RequestFormData) => {
    try {
      const requestBody = {
        customer_id: customerType === "existing" ? undefined : data.customer_id,
        is_guest: customerType === "guest",
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_email: data.customer_email,
        payment_method: data.payment_method,
        country: data.country,
        shipping_address: data.shipping_address,
        order_note: data.order_note,
        product_id: data.product_id,
        quantity: data.quantity,
      };

      await RequestsApi.create(requestBody);

      toast.success(t("createSuccess"));
      onSuccess?.();
      reset();
      onClose();
    } catch (error: any) {
      // Handle 422 validation errors from server
      if (error?.response?.status === 422) {
        const validationErrors = error?.response?.data?.errors;
        if (validationErrors) {
          const firstErrorKey = Object.keys(validationErrors)[0];
          const firstErrorMessage = validationErrors[firstErrorKey][0];
          toast.error(firstErrorMessage);
          return;
        }
      }

      toast.error(t("createError"));
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
        className={`max-w-3xl w-full bg-sidebar max-h-[90vh] overflow-y-auto ${
          isRtl ? "rtl" : "ltr"
        }`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            {t("addNewRequest")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Customer Type */}
            <div>
              <FormLabel required className="text-xs mb-2">
                {t("form.customerType")}
              </FormLabel>
              <RadioField
                field={{
                  name: "is_guest",
                  type: "radio",
                  label: "",
                  options: [
                    { value: "existing", label: t("form.existingCustomer") },
                    { value: "guest", label: t("form.guestCustomer") },
                  ],
                  className: "flex justify-end gap-6",
                }}
                value={customerType}
                onChange={(value: string) => {
                  setCustomerType(value as "existing" | "guest");
                  setValue("is_guest", value as "existing" | "guest");
                }}
                onBlur={() => {}}
              />
            </div>

            {/* Customer Selector - Only show when guest customer is selected */}
            {customerType === "guest" && (
              <div>
                <FormLabel required className="text-xs">
                  {t("form.selectCustomer")}
                </FormLabel>
                <Select
                  value={watch("customer_id")}
                  onValueChange={(value) => {
                    setValue("customer_id", value);
                    // Auto-fill customer details when selected
                    const selectedCustomer = customers.find(
                      (c: any) => c.id === value
                    );
                    if (selectedCustomer) {
                      setValue("customer_name", selectedCustomer.name || "");
                      setValue("customer_phone", selectedCustomer.phone || "");
                      setValue("customer_email", selectedCustomer.email || "");
                    }
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="mt-1 text-white">
                    <SelectValue
                      placeholder={t("form.selectCustomerPlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer: any) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Customer Fields - Only show when guest customer is selected */}
            {customerType === "existing" && (
              <>
                {/* Customer Name */}
                <div>
                  <FormLabel required className="text-xs">
                    {t("form.customerName")}
                  </FormLabel>
                  <Input
                    variant="secondary"
                    {...register("customer_name")}
                    disabled={isSubmitting}
                    placeholder={t("form.customerNamePlaceholder")}
                    className="mt-1"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <FormLabel required className="text-xs">
                    {t("form.phoneNumber")}
                  </FormLabel>
                  <Input
                    variant="secondary"
                    {...register("customer_phone")}
                    disabled={isSubmitting}
                    placeholder={t("form.phoneNumberPlaceholder")}
                    className="mt-1"
                  />
                </div>

                {/* Email */}
                <div>
                  <FormLabel required className="text-xs">
                    {t("form.customerEmail")}
                  </FormLabel>
                  <Input
                    variant="secondary"
                    type="email"
                    {...register("customer_email")}
                    disabled={isSubmitting}
                    placeholder={t("form.customerEmailPlaceholder")}
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {/* Product */}
            <div>
              <FormLabel required className="text-xs">
                {t("form.product")}
              </FormLabel>
              <Select
                value={watch("product_id")}
                onValueChange={(value) => setValue("product_id", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="mt-1 text-white">
                  <SelectValue placeholder={t("form.selectProduct")} />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product: any) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div>
              <FormLabel required className="text-xs">
                {t("form.quantity")}
              </FormLabel>
              <Input
                type="number"
                variant="secondary"
                {...register("quantity", { valueAsNumber: true })}
                disabled={isSubmitting}
                min={1}
                defaultValue={1}
                className="mt-1"
              />
            </div>

            {/* Payment Method */}
            <div>
              <FormLabel required className="text-xs">
                {t("form.paymentMethod")}
              </FormLabel>
              <Select
                value={watch("payment_method")}
                onValueChange={(value) => setValue("payment_method", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="mt-1 text-white">
                  <SelectValue placeholder={t("form.selectPaymentMethod")} />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method: any) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Country */}
            <div>
              <FormLabel required className="text-xs">
                {t("form.country")}
              </FormLabel>
              <Select
                value={watch("country")}
                onValueChange={(value) => setValue("country", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="mt-1 text-white">
                  <SelectValue placeholder={t("form.selectCountry")} />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country: any) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Shipping Address */}
            <div>
              <FormLabel required className="text-xs">
                {t("form.shippingAddress")}
              </FormLabel>
              <Textarea
                {...register("shipping_address")}
                disabled={isSubmitting}
                placeholder={t("form.shippingAddressPlaceholder")}
                className="mt-1 text-white min-h-[100px]"
              />
            </div>

            {/* Order Description */}
            <div>
              <FormLabel className="text-xs">
                {t("form.orderDescription")}
              </FormLabel>
              <Textarea
                {...register("order_note")}
                disabled={isSubmitting}
                placeholder={t("form.orderDescriptionPlaceholder")}
                className="mt-1 text-white min-h-[100px]"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 text-gray-300 hover:bg-gray-800"
            >
              {tCommon("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {tCommon("save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
