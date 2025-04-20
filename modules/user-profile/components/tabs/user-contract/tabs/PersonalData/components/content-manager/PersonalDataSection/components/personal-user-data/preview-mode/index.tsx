import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import PreviewTextField from "../../../../../../../components/PreviewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";

export default function UserProfilePersonalDataReview() {
  const { userPersonalData } = usePersonalDataTabCxt();
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          required={true}
          label="الاسم ثلاثي"
          value={userPersonalData?.name ?? ""}
          valid={Boolean(userPersonalData?.name)}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label="الاسم الشهرة"
          value={userPersonalData?.nickname ?? ""}
          valid={Boolean(userPersonalData?.nickname)}
        />
      </div>
      <div className="p-2">
        <div className="flex items-center gap-2">
          <Switch checked={userPersonalData?.is_default == 1} id="is-default" />
          <Label htmlFor="is-default">افتراضي</Label>
        </div>
      </div>

      {/* Second row */}
      <div className="p-2">
        <PreviewTextField
          label="الجنس"
          value={userPersonalData?.gender ?? ""}
          valid={Boolean(userPersonalData?.gender)}
          isSelect
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label="تاريخ الميلاد"
          value={
            userPersonalData?.birthdate_gregorian
              ? new Date(
                  userPersonalData?.birthdate_gregorian ?? ""
                ).toLocaleDateString()
              : ""
          }
          valid={Boolean(userPersonalData?.birthdate_gregorian)}
          isDate
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label="تاريخ الميلاد (هجري)"
          value={
            userPersonalData?.birthdate_hijri
              ? new Date(
                  userPersonalData?.birthdate_hijri ?? ""
                ).toLocaleDateString()
              : ""
          }
          valid={Boolean(userPersonalData?.birthdate_hijri)}
          isDate
        />
      </div>

      {/* Third row - full width */}
      <div className="p-2 col-span-3">
        <PreviewTextField
          label="الجنسية"
          value={userPersonalData?.country ?? ""}
          valid={Boolean(userPersonalData?.country)}
        />
      </div>
    </div>
  );
}
