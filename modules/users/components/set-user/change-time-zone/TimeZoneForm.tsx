"use client";
import { useFormContext } from "react-hook-form";
import CustomSelect from "@/components/shared/CustomSelect";
import { Button } from "@/components/ui/button";
import { useSetUserLookupsCxt } from "../context/SetUserLookups";
import { toast } from "sonner";
import { useState } from "react";

type PropsT = {
  handleClose: () => void;
};
export default function TimeZoneForm({ handleClose }: PropsT) {
  // control and state for
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const { timeZones, currencies, languages, countries } =
    useSetUserLookupsCxt();
  const formFields = ["country", "timeZone", "currency", "lang"];
  const [error, setError] = useState("");

  const validToSave = () => {
    for (let i = 0; i < formFields.length; i++)
      if (!getValues(formFields[i])) return false;
    return true;
  };

  const handleSave = () => {
    if (validToSave()) {
      setError("");
      setValue("takeTimeZone", true);
      handleClose();
    } else {
      setError("All Fields are required");
    }
  };

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
      <div className="my-4 flex flex-col items-center justify-center">
        <Button className="w-full max-w-sm" onClick={handleSave}>
          حفظ
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
