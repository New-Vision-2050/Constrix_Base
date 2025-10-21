import PreviewTextField from "../../../../../../../components/previewTextField";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";
import { useTranslations } from "next-intl";

export default function UserAddressSectionPreviewMode() {
  const { userContactData } = useConnectionDataCxt();
  const t = useTranslations("UserProfile.nestedTabs.addressData");
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          label={t("addressLabel")}
          value={userContactData?.address ?? ""}
          valid={Boolean(userContactData?.address)}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label={t("zipCode")}
          value={userContactData?.postal_code ?? ""}
          valid={Boolean(userContactData?.postal_code)}
        />
      </div>
    </div>
  );
}
