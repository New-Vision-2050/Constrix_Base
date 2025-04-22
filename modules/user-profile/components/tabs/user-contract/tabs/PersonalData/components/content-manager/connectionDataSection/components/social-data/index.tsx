import SocialDataSectionPreviewMode from "./preview-mode";
import SocialDataSectionEditMode from "./edit-mode";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";

export default function SocialDataSection() {
  // declare and define component state and vars
  const { handleRefetchUserSocialData } = useConnectionDataCxt();

  return (
    <TabTemplate
      title={"حسابات التواصل الاجتماعي"}
      reviewMode={<SocialDataSectionPreviewMode />}
      editMode={<SocialDataSectionEditMode />}
      onChangeMode={() => {
        handleRefetchUserSocialData();
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
