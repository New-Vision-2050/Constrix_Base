import UserIqamaWorkLicenseDataPreviewMode from "./preview-mode";
import UserIqamaWorkLicenseDataEditMode from "./edit-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { useTranslations } from "next-intl";

export default function UserIqamaWorkLicenseData() {
  // declare and define component state and vars
  const { handleRefreshIdentityData, userIdentityDataLoading } =
    usePersonalDataTabCxt();
  const { can } = usePermissions();
  const t = useTranslations("UserProfile.nestedTabs.licenseData");
  const tActions = useTranslations("UserProfile.nestedTabs.commonActions");

  return (
    <Can check={[PERMISSIONS.profile.workLicense.view]}>
      <TabTemplate
        title={t("title")}
        loading={userIdentityDataLoading}
        reviewMode={<UserIqamaWorkLicenseDataPreviewMode />}
        editMode={<UserIqamaWorkLicenseDataEditMode />}
        onChangeMode={() => {
          handleRefreshIdentityData();
        }}
        settingsBtn={{
          items: [
            { title: tActions("myRequests"), onClick: () => {}, disabled: true },
            { title: tActions("createRequest"), onClick: () => {}, disabled: true },
          ],
          disabledEdit: !can([PERMISSIONS.profile.workLicense.update]),
        }}
      />
    </Can>
  );
}
