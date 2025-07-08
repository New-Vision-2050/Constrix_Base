import MainUserConnectionInfoSectionPreview from "./preview-mode/MainUserConnectionInfoSectionPreview";
import MainUserConnectionInfoSectionEdit from "./edit-mode";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useTranslations } from "next-intl";

export default function MainUserConnectionInfoSection() {
  // declare and define component state and vars
  const { handleRefetchUserContactData, userContactDataLoading } =
    useConnectionDataCxt();
  const t = useTranslations("UserProfile.tabs.CommonSections");

  return (
    <TabTemplate
      title={t("connectionData")}
      loading={userContactDataLoading}
      reviewMode={<MainUserConnectionInfoSectionPreview />}
      editMode={<MainUserConnectionInfoSectionEdit />}
      onChangeMode={() => {
        handleRefetchUserContactData();
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
