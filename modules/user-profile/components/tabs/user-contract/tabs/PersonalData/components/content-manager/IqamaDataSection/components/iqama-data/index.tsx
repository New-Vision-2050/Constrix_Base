import UserIqamaDataPreviewMode from "./preview-mode";
import UserIqamaDataEditMode from "./edit-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";

export default function UserIqamaData() {
  // declare and define component state and vars
  const { handleRefreshIdentityData } = usePersonalDataTabCxt();

  return (
    <TabTemplate
      title={"بيانات رقم الحدود - الدخول"}
      reviewMode={<UserIqamaDataPreviewMode />}
      editMode={<UserIqamaDataEditMode />}
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
