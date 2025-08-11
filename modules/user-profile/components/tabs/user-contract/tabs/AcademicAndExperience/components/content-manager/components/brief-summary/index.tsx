import ProfileBriefSummaryEdit from "./ProfileBriefSummaryEdit";
import ProfileBriefSummaryPreview from "./ProfileBriefSummaryPreview";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

export default function ProfileBriefSummary() {
  // declare and define component state and vars
  const { handleRefetchUserBrief } = useUserAcademicTabsCxt();
  const { can } = usePermissions();

  return (
    <Can check={[PERMISSIONS.profile.aboutMe.view]}>
      <TabTemplate
        title="نبذه مختصرة"
        reviewMode={<ProfileBriefSummaryPreview />}
        editMode={<ProfileBriefSummaryEdit />}
        onChangeMode={() => {
          handleRefetchUserBrief();
        }}
        settingsBtn={{
          items: [
            {
              title: "طلباتي",
              onClick: () => {},
              disabled: !can([PERMISSIONS.profile.aboutMe.update]),
            },
            {
              title: "أنشاء طلب",
              onClick: () => {},
              disabled: !can([PERMISSIONS.profile.aboutMe.update]),
            },
          ],
          disabledEdit: !can([PERMISSIONS.profile.aboutMe.update]),
        }}
      />
    </Can>
  );
}
