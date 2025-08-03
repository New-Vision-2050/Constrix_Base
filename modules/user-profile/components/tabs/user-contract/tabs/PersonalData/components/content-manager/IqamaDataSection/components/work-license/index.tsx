import UserIqamaWorkLicenseDataPreviewMode from "./preview-mode";
import UserIqamaWorkLicenseDataEditMode from "./edit-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function UserIqamaWorkLicenseData() {
  // declare and define component state and vars
  const { handleRefreshIdentityData, userIdentityDataLoading } =
    usePersonalDataTabCxt();

  return (
    <TabTemplate
      title={"بيانات رخصة العمل"}
      loading={userIdentityDataLoading}
      reviewMode={
        <Can check={[PERMISSIONS.profile.workLicense.view]}>
          <UserIqamaWorkLicenseDataPreviewMode />
        </Can>
      }
      editMode={
        <Can check={[PERMISSIONS.profile.workLicense.update]}>
          <UserIqamaWorkLicenseDataEditMode />
        </Can>
      }
      onChangeMode={() => {
        handleRefreshIdentityData();
      }}
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {} ,disabled:true},
          { title: "أنشاء طلب", onClick: () => {},disabled:true },
        ],
      }}
    />
  );
}
