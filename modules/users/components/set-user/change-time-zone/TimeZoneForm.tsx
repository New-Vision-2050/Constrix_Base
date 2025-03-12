"use client";
import { useFormContext } from "react-hook-form";
import CustomSelect from "@/components/shared/CustomSelect";
import { Button } from "@/components/ui/button";
import { useSetUserLookupsCxt } from "../context/SetUserLookups";

type PropsT = {
  handleClose: () => void;
};
export default function TimeZoneForm({ handleClose }: PropsT) {
  // control and state for
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { timeZones, currencies, languages, countries } =
    useSetUserLookupsCxt();

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* country */}
        <CustomSelect
          name="country"
          control={control}
          required={true}
          options={countries?.map((ele) => ({
            label: ele.name,
            value: ele.id,
          }))}
          placeholder="الدولة"
          error={Boolean(errors.country)}
          // errorMessage={errors?.country?.message ?? ""}
        />
        {/* timeZone */}
        <CustomSelect
          name="timeZone"
          control={control}
          required={true}
          options={timeZones?.map((ele) => ({
            label: `${ele.country}-${ele.time_zone}`,
            value: ele.id,
          }))}
          placeholder="المنطقة الزمنية"
          error={Boolean(errors.timeZone)}
          // errorMessage={errors?.timeZone?.message ?? ""}
        />
        {/* currency */}
        <CustomSelect
          name="currency"
          control={control}
          required={true}
          options={currencies?.map((ele) => ({
            label: ele.short_name,
            value: ele.id,
          }))}
          placeholder="العملة"
          error={Boolean(errors.currency)}
          // errorMessage={errors?.currency?.message ?? ""}
        />
        {/* lang */}
        <CustomSelect
          name="lang"
          control={control}
          required={true}
          options={languages?.map((ele) => ({
            label: `${ele.short_name}-${ele.name}`,
            value: ele.id,
          }))}
          placeholder="اللغة"
          error={Boolean(errors.lang)}
          // errorMessage={errors?.lang?.message ?? ""}
        />
      </div>
      <div className="my-4 flex items-center justify-center">
        <Button
          className="w-full max-w-sm"
          onClick={() => {
            setValue("takeTimeZone", true);
            handleClose();
          }}
        >
          حفظ
        </Button>
      </div>
    </div>
  );
}
