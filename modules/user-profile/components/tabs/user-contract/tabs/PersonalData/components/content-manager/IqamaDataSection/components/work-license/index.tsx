import UserIqamaWorkLicenseDataPreviewMode from "./preview-mode";
import UserIqamaWorkLicenseDataEditMode from "./edit-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

export default function UserIqamaWorkLicenseData() {
  // declare and define component state and vars
  const { handleRefreshIdentityData, userIdentityDataLoading } =
    usePersonalDataTabCxt();
  const { can } = usePermissions();

  return (
    <Can check={[PERMISSIONS.profile.workLicense.view]}>
      <TabTemplate
        title={"بيانات رخصة العمل"}
        loading={userIdentityDataLoading}
        reviewMode={<UserIqamaWorkLicenseDataPreviewMode />}
        editMode={<UserIqamaWorkLicenseDataEditMode />}
        onChangeMode={() => {
          handleRefreshIdentityData();
        }}
        settingsBtn={{
          items: [
            { title: "طلباتي", onClick: () => {}, disabled: true },
            { title: "أنشاء طلب", onClick: () => {}, disabled: true },
          ],
          disabledEdit: !can([PERMISSIONS.profile.workLicense.update]),
        }}
      />
    </Can>
  );
}
