import SocialDataSectionPreviewMode from "./preview-mode";
import SocialDataSectionEditMode from "./edit-mode";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";

export default function SocialDataSection() {
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
    />
  );
}
