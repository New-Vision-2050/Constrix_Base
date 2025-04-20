import UserProfilePassportDataReview from "./preview-mode";
import UserProfilePassportDataEditForm from "./edit-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";

export default function PassportDataSectionPersonalForm() {
  // declare and define component state and vars
  const { handleRefreshIdentityData } = usePersonalDataTabCxt();

  return (
    <TabTemplate
      title="البيانات جواز السفر"
      reviewMode={<UserProfilePassportDataReview />}
      editMode={<UserProfilePassportDataEditForm />}
      onChangeMode={() => {
        handleRefreshIdentityData();
      }}
    />
  );
}
