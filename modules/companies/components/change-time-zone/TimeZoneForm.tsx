"use client";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { AxiosError } from "axios";
import CustomSelect from "@/components/shared/CustomSelect";
import { Button } from "@/components/ui/button";
import { timeZoneSchema, TimeZoneSchema } from "../../schema/changeTimeZone";
import { zodResolver } from "@hookform/resolvers/zod";

export default function TimeZoneForm() {
  // control and state for
  const innerForm = useForm<TimeZoneSchema>({
    resolver: zodResolver(timeZoneSchema),
    defaultValues: {},
    mode: "onBlur",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = innerForm;

  // component helpers
  const onSubmit = async (data: TimeZoneSchema) => {
    try {
      console.log("submitted data", data);
      // Show error message
      toast.success("Success", {
        description: "Time Zone Changed Successfully",
        duration: 3000,
        dismissible: true,
      });
    } catch (error) {
      const axError = error as AxiosError;
      // Show error message
      toast.error("Failed", {
        description:
          axError?.message ?? "Please check your inputs and try again.",
        duration: 3000,
        dismissible: true,
      });
    }
  };

  return (
    <>
      <FormProvider {...innerForm}>
        {/* Sonner Toast Provider */}
        <form onSubmit={handleSubmit(onSubmit)} className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* country */}
            <CustomSelect
              name="country"
              control={control}
              required={true}
              options={[]}
              placeholder="الدولة"
              error={Boolean(errors.country)}
              errorMessage={errors?.country?.message ?? ""}
            />
            {/* timeZone */}
            <CustomSelect
              name="timeZone"
              control={control}
              required={true}
              options={[]}
              placeholder="المنطقة الزمنية"
              error={Boolean(errors.timeZone)}
              errorMessage={errors?.timeZone?.message ?? ""}
            />
            {/* currency */}
            <CustomSelect
              name="currency"
              control={control}
              required={true}
              options={[]}
              placeholder="العملة"
              error={Boolean(errors.currency)}
              errorMessage={errors?.currency?.message ?? ""}
            />
            {/* lang */}
            <CustomSelect
              name="lang"
              control={control}
              required={true}
              options={[]}
              placeholder="اللغة"
              error={Boolean(errors.lang)}
              errorMessage={errors?.lang?.message ?? ""}
            />
          </div>
          <div className="my-4 flex items-center justify-center">
            <Button type="submit" className="w-full max-w-sm">
              حفظ
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
