import ProfileBriefSummaryEdit from "./ProfileBriefSummaryEdit";
import ProfileBriefSummaryPreview from "./ProfileBriefSummaryPreview";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";
import CanSeeContent from "@/components/shared/CanSeeContent";

export default function ProfileBriefSummary() {
  // declare and define component state and vars
  const { handleRefetchUserBrief } = useUserAcademicTabsCxt();
  const canEdit = can(PERMISSION_ACTIONS.UPDATE, PERMISSION_SUBJECTS.PROFILE_ABOUT_ME) as boolean;
  const canView = can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.PROFILE_ABOUT_ME) as boolean;

  return (
    <CanSeeContent canSee={canView}>
      <TabTemplate
        title="نبذه مختصرة"
        canEdit={canEdit}
        reviewMode={<ProfileBriefSummaryPreview />}
        editMode={<ProfileBriefSummaryEdit />}
        onChangeMode={() => {
          handleRefetchUserBrief();
        }}
        settingsBtn={{
          items: [
            { title: "طلباتي", onClick: () => {} ,disabled:true},
            { title: "أنشاء طلب", onClick: () => {},disabled:true },
          ],
        }}
      />
    </CanSeeContent>
  );
}
