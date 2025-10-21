import SocialDataSectionPreviewMode from "./preview-mode";
import SocialDataSectionEditMode from "./edit-mode";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { useTranslations } from "next-intl";

export default function SocialDataSection() {
  // declare and define component state and vars
  const { handleRefetchUserSocialData, userSocialDataLoading } =
    useConnectionDataCxt();
  const { can } = usePermissions();
  const t = useTranslations("UserProfile.nestedTabs.socialData");

  return (
    <Can check={[PERMISSIONS.profile.socialMedia.view]}>
      <TabTemplate
        title={t("title")}
        loading={userSocialDataLoading}
        reviewMode={<SocialDataSectionPreviewMode />}
        editMode={<SocialDataSectionEditMode />}
        onChangeMode={() => {
          handleRefetchUserSocialData();
        }}
        settingsBtn={{
          items: [
            { title: "طلباتي", onClick: () => {}, disabled: true },
            { title: "أنشاء طلب", onClick: () => {}, disabled: true },
          ],
          disabledEdit: !can([PERMISSIONS.profile.socialMedia.update]),
        }}
      />
    </Can>
  );
}
