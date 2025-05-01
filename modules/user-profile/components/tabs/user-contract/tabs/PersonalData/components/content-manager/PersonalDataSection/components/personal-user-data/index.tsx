import UserProfilePersonalDataEditForm from "./edit-mode";
import UserProfilePersonalDataReview from "./preview-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";

export default function PersonalDataSectionPersonalForm() {
  // declare and define component state and vars
  const { userPersonalDataLoading, handleRefreshPersonalData } =
    usePersonalDataTabCxt();

  return (
    <TabTemplate
      title="البيانات الشخصية"
      loading={userPersonalDataLoading}
      reviewMode={<UserProfilePersonalDataReview />}
      editMode={<UserProfilePersonalDataEditForm />}
      onChangeMode={() => {
        handleRefreshPersonalData();
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
