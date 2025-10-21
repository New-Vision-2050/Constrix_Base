import MainUserConnectionInfoSectionPreview from "./preview-mode/MainUserConnectionInfoSectionPreview";
import MainUserConnectionInfoSectionEdit from "./edit-mode";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { useTranslations } from "next-intl";

export default function MainUserConnectionInfoSection() {
  // declare and define component state and vars
  const { can } = usePermissions();
  const { handleRefetchUserContactData, userContactDataLoading } =
    useConnectionDataCxt();
  const t = useTranslations("UserProfile.nestedTabs.connectionData");

  return (
    <Can check={[PERMISSIONS.profile.contactInfo.view]}>
      <TabTemplate
        title={t("title")}
        loading={userContactDataLoading}
        reviewMode={<MainUserConnectionInfoSectionPreview />}
        editMode={<MainUserConnectionInfoSectionEdit />}
        onChangeMode={() => {
          handleRefetchUserContactData();
        }}
        settingsBtn={{
          items: [
            { title: "طلباتي", onClick: () => {}, disabled: true },
            { title: "أنشاء طلب", onClick: () => {}, disabled: true },
          ],
          disabledEdit: !can([PERMISSIONS.profile.contactInfo.update]),
        }}
      />
    </Can>
  );
}
