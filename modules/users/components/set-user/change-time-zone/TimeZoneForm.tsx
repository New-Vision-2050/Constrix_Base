"use client";
import { useFormContext } from "react-hook-form";
import CustomSelect from "@/components/shared/CustomSelect";
import { Button } from "@/components/ui/button";

export default function TimeZoneForm() {
  // control and state for
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* country */}
        <CustomSelect
          name="country"
          control={control}
          required={true}
          options={[]}
          placeholder="الدولة"
          error={Boolean(errors.country)}
          // errorMessage={errors?.country?.message ?? ""}
        />
        {/* timeZone */}
        <CustomSelect
          name="timeZone"
          control={control}
          required={true}
          options={[]}
          placeholder="المنطقة الزمنية"
          error={Boolean(errors.timeZone)}
          // errorMessage={errors?.timeZone?.message ?? ""}
        />
        {/* currency */}
        <CustomSelect
          name="currency"
          control={control}
          required={true}
          options={[]}
          placeholder="العملة"
          error={Boolean(errors.currency)}
          // errorMessage={errors?.currency?.message ?? ""}
        />
        {/* lang */}
        <CustomSelect
          name="lang"
          control={control}
          required={true}
          options={[]}
          placeholder="اللغة"
          error={Boolean(errors.lang)}
          // errorMessage={errors?.lang?.message ?? ""}
        />
      </div>
      <div className="my-4 flex items-center justify-center">
        <Button type="submit" className="w-full max-w-sm">
          حفظ
        </Button>
      </div>
    </div>
  );
}
