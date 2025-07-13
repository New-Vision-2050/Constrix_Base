import UserProfilePersonalDataEditForm from "./edit-mode";
import UserProfilePersonalDataReview from "./preview-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

export default function PersonalDataSectionPersonalForm() {
  const canEdit = can(PERMISSION_ACTIONS.UPDATE, PERMISSION_SUBJECTS.USER_PROFILE_DATA) as boolean;
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
      canEdit={canEdit}
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {} ,disabled:true},
          { title: "أنشاء طلب", onClick: () => {},disabled:true },
        ],
      }}
    />
  );
}
