import { Button } from "@/components/ui/button"; // Adjust import path as needed
import { Checkbox } from "@/modules/table/components/ui/checkbox";
import { changeLocalTimeConfig } from "../configs/changeLocalTimeConfig";
import DialogFormBuilder from "./DialogFormBuilder";
import { useFormStore } from "../hooks/useFormStore";

interface TimeZoneCheckboxProps {
  field: any; // You might want to specify a more specific type based on your form library
  value: boolean;
  onChange: (value: boolean) => void;
}

export const TimeZoneCheckbox: React.FC<TimeZoneCheckboxProps> = ({
  field,
  value,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={value}
        onCheckedChange={(b: boolean) => {
          if (b) {
            const country = useFormStore
              ?.getState()
              .getValue("companies-form", "local-time");

            if(country) {
                const countryId = country['country-id'];
                if (countryId)
                    useFormStore.getState().setValues("companies-form", {
                        country_id: countryId,
                    });
            }
          }
          onChange(b);
        }}
      />
      <div className="flex items-center gap-1">
        <p className="text-sm">لتأكيد تغيير المنطقة الزمنية،</p>
        <DialogFormBuilder
          config={changeLocalTimeConfig}
          trigger={
            <Button className="p-0 h-fit text-primary bg-transparent hover:bg-transparent" onClick={() => {
                const localTime = useFormStore
                    ?.getState()
                    .getValue("companies-form", "local-time");
                useFormStore.getState().setValues('change-local-time-form', localTime)
            }}>
              اضغط هنا
            </Button>
          }
        />{" "}
      </div>
    </div>
  );
};
