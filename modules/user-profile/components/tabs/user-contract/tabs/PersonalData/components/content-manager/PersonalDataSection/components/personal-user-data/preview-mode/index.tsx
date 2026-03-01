import "./index.css";
import { Label } from "@/components/ui/label";
import PreviewTextField from "../../../../../../../components/previewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { useTranslations } from "next-intl";

export default function UserProfilePersonalDataReview() {
  const { userPersonalData } = usePersonalDataTabCxt();
  const t = useTranslations("UserProfile.nestedTabs.PeronalDataTab");

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          label={t("name")}
          required
          value={userPersonalData?.name ?? ""}
          valid={Boolean(userPersonalData?.name)}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label={t("nickname")}
          value={userPersonalData?.nickname ?? ""}
          valid={Boolean(userPersonalData?.nickname)}
        />
      </div>
      <div className="p-2">
        <div className="flex items-center gap-2">
          <label className="switch">
            <input
              disabled
              checked={userPersonalData?.is_default == 1}
              type="checkbox"
            />
            <span className="slider"></span>
          </label>
          <Label htmlFor="is-default">{t("isDefault")}</Label>
        </div>
      </div>

      {/* Second row */}
      <div className="p-2">
        <PreviewTextField
          label={t("gender")}
          value={userPersonalData?.gender == "male" ? "ذكر" : "انثى"}
          valid={Boolean(userPersonalData?.gender)}
          type="select"
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label={t("birthDate")}
          value={
            userPersonalData?.birthdate_gregorian
              ? new Date(
                userPersonalData?.birthdate_gregorian ?? ""
              ).toLocaleDateString()
              : ""
          }
          valid={Boolean(userPersonalData?.birthdate_gregorian)}
          type="date"
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label={t("birthDateHijri")}
          value={userPersonalData?.birthdate_hijri ?? ""}
          valid={Boolean(userPersonalData?.birthdate_hijri)}
          type="date"
        />
      </div>

      {/* Third row - full width */}
      <div className="p-2 col-span-3">
        <PreviewTextField
          label={t("nationality")}
          required
          value={userPersonalData?.country ?? ""}
          valid={Boolean(userPersonalData?.country)}
        />
      </div>
    </div>
  );
}
