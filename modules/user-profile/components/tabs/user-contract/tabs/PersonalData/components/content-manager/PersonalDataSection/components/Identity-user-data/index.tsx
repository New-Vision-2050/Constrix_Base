import UserProfileConnectionDataEditForm from "./edit-mode";
import UserProfileIdentityDataReview from "./preview-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";

export default function IdentityDataSectionPersonalForm() {
  // declare and define component state and vars
  const { handleRefreshIdentityData } = usePersonalDataTabCxt();

  return (
    <TabTemplate
      title={"البيانات الهوية"}
      reviewMode={<UserProfileIdentityDataReview />}
      editMode={<UserProfileConnectionDataEditForm />}
      onChangeMode={() => {
        handleRefreshIdentityData();
      }}
    />
  );
}
