import SocialDataSectionPreviewMode from "./preview-mode";
import SocialDataSectionEditMode from "./edit-mode";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";
import { useTranslations } from "next-intl";

export default function SocialDataSection() {
  // declare and define component state and vars
  const { handleRefetchUserSocialData, userSocialDataLoading } =
    useConnectionDataCxt();
  const t = useTranslations("UserProfile.tabs.CommonSections");

  return (
    <TabTemplate
      title={t("socialData")}
      loading={userSocialDataLoading}
      reviewMode={<SocialDataSectionPreviewMode />}
      editMode={<SocialDataSectionEditMode />}
      onChangeMode={() => {
        handleRefetchUserSocialData();
      }}
      settingsBtn={{
        items: [
          { title: t("myRequests"), onClick: () => {} ,disabled:true},
          { title: t("createRequest"), onClick: () => {},disabled:true },
        ],
      }}
    />
  );
}
