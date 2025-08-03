import SocialDataSectionPreviewMode from "./preview-mode";
import SocialDataSectionEditMode from "./edit-mode";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function SocialDataSection() {
  // declare and define component state and vars
  const { handleRefetchUserSocialData, userSocialDataLoading } =
    useConnectionDataCxt();

  return (
    <TabTemplate
      title={"حسابات التواصل الاجتماعي"}
      loading={userSocialDataLoading}
      reviewMode={
        <Can check={[PERMISSIONS.profile.socialMedia.view]}>
          <SocialDataSectionPreviewMode />
        </Can>
      }
      editMode={
        <Can check={[PERMISSIONS.profile.socialMedia.update]}>
          <SocialDataSectionEditMode />
        </Can>
      }
      onChangeMode={() => {
        handleRefetchUserSocialData();
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
