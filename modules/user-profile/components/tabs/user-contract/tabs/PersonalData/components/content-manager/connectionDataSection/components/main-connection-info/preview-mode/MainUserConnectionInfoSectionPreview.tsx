import PreviewTextField from "../../../../../../../components/previewTextField";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";
import { useTranslations } from "next-intl";

export default function MainUserConnectionInfoSectionPreview() {
  const { userContactData } = useConnectionDataCxt();
  const t = useTranslations("UserProfile.nestedTabs.connectionData");

  console.log("userContactData101", userContactData);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          label={t("email")}
          valid={Boolean(userContactData?.email)}
          value={userContactData?.email ?? ""}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label={t("phone")}
          valid={Boolean(userContactData?.phone)}
          value={userContactData?.phone ?? ""}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label={t("otherPhone")}
          valid={Boolean(userContactData?.other_phone)}
          value={userContactData?.other_phone ?? ""}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label={t("landlineNumber")}
          valid={Boolean(userContactData?.landline_number)}
          value={userContactData?.landline_number ?? ""}
        />
      </div>
    </div>
  );
}
