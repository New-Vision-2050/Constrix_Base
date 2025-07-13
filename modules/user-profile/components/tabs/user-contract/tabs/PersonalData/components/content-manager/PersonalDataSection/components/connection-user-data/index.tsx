import { can } from "@/hooks/useCan";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import { ConnectionOTPCxtProvider } from "./context/ConnectionOTPCxt";
import UserProfileConnectionDataEditForm from "./edit-mode";
import UserProfileConnectionDataEditForm2 from "./edit-mode-v2";
import UserProfileConnectionDataReview from "./preview-mode";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

export default function ConnectionDataSectionPersonalForm() {
    const canEdit = can(PERMISSION_ACTIONS.UPDATE, PERMISSION_SUBJECTS.USER_PROFILE_CONTACT) as boolean;
  
  // declare and define component state and vars
  const { userConnectionDataLoading } = usePersonalDataTabCxt();

  return (
    <ConnectionOTPCxtProvider>
      <TabTemplate
        title={"بيانات الاتصال"}
        loading={userConnectionDataLoading}
        reviewMode={<UserProfileConnectionDataReview />}
        editMode={<UserProfileConnectionDataEditForm2 />}
        settingsBtn={{
          items: [
            { title: "طلباتي", onClick: () => {} ,disabled:true},
            { title: "أنشاء طلب", onClick: () => {},disabled:true },
          ],
        }}
        canEdit={canEdit}
      />
    </ConnectionOTPCxtProvider>
  );
}
