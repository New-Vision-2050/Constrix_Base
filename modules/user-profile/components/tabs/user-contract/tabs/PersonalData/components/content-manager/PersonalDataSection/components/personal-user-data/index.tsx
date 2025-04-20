import UserProfilePersonalDataEditForm from "./edit-mode";
import UserProfilePersonalDataReview from "./preview-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";

export default function PersonalDataSectionPersonalForm() {
  // declare and define component state and vars
  const { handleRefreshPersonalData } = usePersonalDataTabCxt();

  return (
    <TabTemplate
      title="البيانات الشخصية"
      reviewMode={<UserProfilePersonalDataReview />}
      editMode={<UserProfilePersonalDataEditForm />}
      onChangeMode={() => {
        handleRefreshPersonalData();
      }}
    />
  );
}
