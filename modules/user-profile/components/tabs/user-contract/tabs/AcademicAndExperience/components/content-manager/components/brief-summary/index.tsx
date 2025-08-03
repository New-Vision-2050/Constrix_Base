import ProfileBriefSummaryEdit from "./ProfileBriefSummaryEdit";
import ProfileBriefSummaryPreview from "./ProfileBriefSummaryPreview";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function ProfileBriefSummary() {
  // declare and define component state and vars
  const { handleRefetchUserBrief } = useUserAcademicTabsCxt();

  return (
    <TabTemplate
      title="نبذه مختصرة"
      reviewMode={
        <Can check={[PERMISSIONS.profile.aboutMe.view]}>
          <ProfileBriefSummaryPreview />
        </Can>
      }
      editMode={
        <Can check={[PERMISSIONS.profile.aboutMe.update]}>
          <ProfileBriefSummaryEdit />
        </Can>
      }
      onChangeMode={() => {
        handleRefetchUserBrief();
      }}
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {}, disabled: true },
          { title: "أنشاء طلب", onClick: () => {}, disabled: true },
        ],
      }}
    />
  );
}
