import UserIqamaDataPreviewMode from "./preview-mode";
import UserIqamaDataEditMode from "./edit-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

export default function UserIqamaData() {
  const canEdit = can(PERMISSION_ACTIONS.UPDATE , PERMISSION_SUBJECTS.PROFILE_RESIDENCE_INFO) as boolean;
  // declare and define component state and vars
  const { handleRefreshIdentityData, userIdentityDataLoading } =
    usePersonalDataTabCxt();

  return (
    <TabTemplate
      title={"بيانات رقم الأقامة"}
      loading={userIdentityDataLoading}
      reviewMode={<UserIqamaDataPreviewMode />}
      editMode={<UserIqamaDataEditMode />}
      onChangeMode={() => {
        handleRefreshIdentityData();
      }}
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {} ,disabled:true},
          { title: "أنشاء طلب", onClick: () => {},disabled:true },
        ],
      }}
      canEdit={canEdit}
    />
  );
}
