import UserIqamaBorderNumberPreviewMode from "./preview-mode";
import UserIqamaBorderNumberEditMode from "./edit-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

export default function UserIqamaBorderNumber() {
  const canEdit = can(PERMISSION_ACTIONS.UPDATE , PERMISSION_SUBJECTS.PROFILE_BORDER_NUMBER) as boolean;
  // declare and define component state and vars
  const { handleRefreshIdentityData, userIdentityDataLoading } =
    usePersonalDataTabCxt();

  return (
    <TabTemplate
      title={"بيانات رقم الحدود - الدخول"}
      loading={userIdentityDataLoading}
      reviewMode={<UserIqamaBorderNumberPreviewMode />}
      editMode={<UserIqamaBorderNumberEditMode />}
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
