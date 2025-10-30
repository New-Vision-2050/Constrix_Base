"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { Loader2 } from "lucide-react";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { toast } from "sonner";
import { Textarea } from "@/modules/table/components/ui/textarea";
import { getCountries } from "@/services/api/shared/countries";
import { ProductsApi } from "@/services/api/ecommerce/products";
import { PaymentMethodsApi } from "@/services/api/ecommerce/payment-methods";
import { RequestsApi, Client } from "@/services/api/ecommerce/requests";
import RadioField from "@/modules/form-builder/components/fields/RadioField";
import MultiSelect from "@/components/shared/MultiSelect";

const createRequestSchema = (t: (key: string) => string) =>
  z.object({
    is_guest: z.enum(["existing", "guest"]),
    customer_id: z.array(z.string()).optional(),
    customer_name: z.string().min(1, t("form.customerNameRequired")),
    customer_phone: z.string().min(1, t("form.customerPhoneRequired")),
    customer_email: z.string().email(t("form.customerEmailInvalid")),
    payment_method: z.string().min(1, t("form.paymentMethodRequired")),
    country: z.string().min(1, t("form.countryRequired")),
    shipping_address: z.string().min(1, t("form.shippingAddressRequired")),
    order_note: z.string().optional(),
    order_items: z.array(z.string()).min(1, t("form.productRequired")),
    quantity: z.number().min(1, t("form.quantityRequired")),
  });

type RequestFormData = z.infer<ReturnType<typeof createRequestSchema>>;

interface AddRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  requestId?: string;
}

export default function AddRequestDialog({
  open,
  onClose,
  onSuccess,
  requestId,
}: AddRequestDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations("requests");
  const tCommon = useTranslations("labels");
  const [customerType, setCustomerType] = useState<"existing" | "guest">(
    "existing"
  );

  const isEditMode = Boolean(requestId);

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
    queryFn: () => RequestsApi.getClients(),
    enabled: open && customerType === "guest",
  });

  // Fetch request data when editing
  const { data: requestData } = useQuery({
    queryKey: ["request-detail", requestId],
    queryFn: () => RequestsApi.getDetails(requestId!),
    enabled: open && isEditMode,
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
      customer_id: [],
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      payment_method: "",
      country: "",
      shipping_address: "",
      order_note: "",
      order_items: [],
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

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && requestData?.payload && open) {
      const request = requestData.payload;
      const isGuest = request.customer_id ? false : true;
      reset({
        is_guest: isGuest ? "guest" : "existing",
        customer_id: request.customer_id ? [request.customer_id] : [],
        customer_name: request.customer_name || "",
        customer_phone: request.customer_phone || "",
        customer_email: request.customer_email || "",
        payment_method: request.payment_method || "",
        country: request.country || "",
        shipping_address: request.shipping_address || "",
        order_note: request.order_note || "",
        order_items: request.items?.map((item) => item.product_id) || [],
        quantity: request.items?.[0]?.quantity || 1,
      });
      setCustomerType(isGuest ? "guest" : "existing");
    }
  }, [isEditMode, requestData, open, reset]);

  const paymentMethods = paymentMethodsData?.data?.payload || [];
  const countries = countriesData?.data?.payload || [];
  // Handle both array and paginated response structures
  const productsPayload = productsData?.data?.payload;
  const products = Array.isArray(productsPayload)
    ? productsPayload
    : (productsPayload as any)?.data || [];
  const customers = customersData?.payload || [];

  const onSubmit = async (data: RequestFormData) => {
    try {
      // Transform order_items to include product_id and quantity
      const orderItems = data.order_items.map((productId) => ({
        product_id: productId,
        quantity: data.quantity,
      }));

      if (isEditMode && requestId) {
        // Update request - use UpdateRequestPayload format
        const updateBody = {
          customer_id:
            customerType === "guest" ? undefined : data.customer_id?.[0],
          is_guest: data.is_guest === "existing",
          customer_name: data.customer_name,
          customer_phone: data.customer_phone,
          customer_email: data.customer_email,
          payment_method: data.payment_method,
          country: data.country,
          shipping_address: data.shipping_address,
          order_note: data.order_note,
          product_id: data.order_items[0],
          quantity: data.quantity,
        };
        await RequestsApi.update(requestId, updateBody);
        toast.success(t("updateSuccess"));
      } else {
        // Create request - use CreateRequestPayload format
        const createBody = {
          customer_id: customerType === "guest" ? null : data.customer_id?.[0],
          is_guest: data.is_guest === "existing",
          customer_name: data.customer_name,
          customer_phone: data.customer_phone,
          customer_email: data.customer_email,
          payment_method: data.payment_method,
          country: data.country,
          shipping_address: data.shipping_address,
          order_note: data.order_note,
          order_items: orderItems,
        };
        await RequestsApi.create(createBody);
        toast.success(t("createSuccess"));
      }

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-3xl w-full bg-sidebar max-h-[90vh] overflow-y-auto ${
          isRtl ? "rtl" : "ltr"
        }`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            {isEditMode ? t("editRequest") : t("addNewRequest")}
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
                    { value: "guest", label: t("form.guestCustomer") },
                    { value: "existing", label: t("form.existingCustomer") },
                  ],
                  className: "flex justify-end gap-6",
                }}
                value={customerType}
                onChange={(value: string) => {
                  setCustomerType(value as "existing" | "guest");
                  setValue("is_guest", value as "existing" | "guest");

                  // Clear customer-related fields when switching
                  if (value === "existing") {
                    // Clear customer selector when switching to existing
                    setValue("customer_id", []);
                  } else {
                    // Clear customer details when switching to guest
                    setValue("customer_name", "");
                    setValue("customer_phone", "");
                    setValue("customer_email", "");
                  }
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
                <div className="mt-1">
                  <MultiSelect
                    options={customers.map((customer: Client) => ({
                      id: customer.id,
                      name: customer.name,
                    }))}
                    value={watch("customer_id") || []}
                    onChange={(value) => setValue("customer_id", value)}
                    placeholder={t("form.selectCustomerPlaceholder")}
                    searchPlaceholder="بحث عن عميل..."
                  />
                </div>
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
              <div className="mt-1">
                <MultiSelect
                  options={products.map((product: any) => ({
                    id: product.id,
                    name: product.name,
                  }))}
                  value={watch("order_items") || []}
                  onChange={(value) => setValue("order_items", value)}
                  placeholder={t("form.selectProduct")}
                  searchPlaceholder="بحث عن منتج..."
                />
              </div>
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
                    <SelectItem key={method.id} value={method.type}>
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
              onClick={() => {
                if (!isSubmitting) {
                  reset();
                  onClose();
                }
              }}
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
