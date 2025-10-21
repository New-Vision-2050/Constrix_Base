import PreviewTextField from "../../../../../../../components/previewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { useTranslations } from "next-intl";

export default function UserProfileConnectionDataReview() {
  const { userConnectionData } = usePersonalDataTabCxt();
  const t = useTranslations("UserProfile.nestedTabs.connectionData");

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userConnectionData?.phone)}
          label={t("phone")}
          value={userConnectionData?.phone ?? ""}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userConnectionData?.email)}
          label={t("email")}
          value={userConnectionData?.email ?? ""}
        />
      </div>
    </div>
  );
}
