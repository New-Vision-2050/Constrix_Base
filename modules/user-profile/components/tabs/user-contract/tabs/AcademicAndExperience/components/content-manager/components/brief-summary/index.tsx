import ProfileBriefSummaryEdit from "./ProfileBriefSummaryEdit";
import ProfileBriefSummaryPreview from "./ProfileBriefSummaryPreview";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";

export default function ProfileBriefSummary() {
  // declare and define component state and vars
  const { handleRefetchUserBrief } = useUserAcademicTabsCxt();

  return (
    <TabTemplate
      title="نبذه مختصرة"
      reviewMode={<ProfileBriefSummaryPreview />}
      editMode={<ProfileBriefSummaryEdit />}
      onChangeMode={() => {
        handleRefetchUserBrief();
      }}
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {} },
          { title: "أنشاء طلب", onClick: () => {} },
        ],
      }}
    />
  );
}
