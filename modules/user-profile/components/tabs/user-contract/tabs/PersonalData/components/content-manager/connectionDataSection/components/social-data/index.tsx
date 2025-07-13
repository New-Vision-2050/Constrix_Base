import SocialDataSectionPreviewMode from "./preview-mode";
import SocialDataSectionEditMode from "./edit-mode";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

export default function SocialDataSection() {
  const canEdit = can(PERMISSION_ACTIONS.UPDATE , PERMISSION_SUBJECTS.PROFILE_SOCIAL_MEDIA) as boolean;
  // declare and define component state and vars
  const { handleRefetchUserSocialData, userSocialDataLoading } =
    useConnectionDataCxt();

  return (
    <TabTemplate
      title={"حسابات التواصل الاجتماعي"}
      loading={userSocialDataLoading}
      reviewMode={<SocialDataSectionPreviewMode />}
      editMode={<SocialDataSectionEditMode />}
      onChangeMode={() => {
        handleRefetchUserSocialData();
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
