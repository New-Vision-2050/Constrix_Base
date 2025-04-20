import UserIqamaWorkLicenseDataPreviewMode from "./preview-mode";
import UserIqamaWorkLicenseDataEditMode from "./edit-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";

export default function UserIqamaWorkLicenseData() {
  // declare and define component state and vars
  const { handleRefreshIdentityData } = usePersonalDataTabCxt();

  return (
    <TabTemplate
      title={"بيانات رخصة العمل"}
      reviewMode={<UserIqamaWorkLicenseDataPreviewMode />}
      editMode={<UserIqamaWorkLicenseDataEditMode />}
      onChangeMode={() => {
        handleRefreshIdentityData();
      }}
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {} },
          { title: "أنشاء طلب", onClick: () => {} },
        ],
      }}
    />
  );
}
