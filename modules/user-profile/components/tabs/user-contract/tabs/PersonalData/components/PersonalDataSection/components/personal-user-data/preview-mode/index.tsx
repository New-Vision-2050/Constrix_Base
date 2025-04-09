import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import PreviewTextField from "../../PreviewTextField";

export default function UserProfilePersonalDataReview() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          required={true}
          valid={true}
          label="الاسم ثلاثي"
          value="Sallam"
        />
      </div>
      <div className="p-2">
        <PreviewTextField valid={false} label="الاسم الشهرة" value="Sallam" />
      </div>
      <div className="p-2">
        <div className="flex items-center gap-2">
          <Switch id="is-default" />
          <Label htmlFor="is-default">افتراضي</Label>
        </div>
      </div>

      {/* Second row */}
      <div className="p-2">
        <PreviewTextField valid={true} label="الجنس" value="ذكر" isSelect />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="تاريخ الميلاد"
          value="05-02-1991"
          isDate
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={false}
          label="تاريخ الميلاد (هجري)"
          value="05-02-1991"
          isDate
        />
      </div>

      {/* Third row - full width */}
      <div className="p-2 col-span-3">
        <PreviewTextField valid={true} label="الجنسية" value="سعودي" />
      </div>
    </div>
  );
}
