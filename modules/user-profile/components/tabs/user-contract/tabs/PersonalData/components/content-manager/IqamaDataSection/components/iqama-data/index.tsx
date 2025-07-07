import UserIqamaDataPreviewMode from "./preview-mode";
import UserIqamaDataEditMode from "./edit-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useTranslations } from "next-intl";

export default function UserIqamaData() {
  // declare and define component state and vars
  const { handleRefreshIdentityData, userIdentityDataLoading } =
    usePersonalDataTabCxt();
  const t = useTranslations("UserProfile.tabs.CommonSections");

  return (
    <TabTemplate
      title={t("iqamaData")}
      loading={userIdentityDataLoading}
      reviewMode={<UserIqamaDataPreviewMode />}
      editMode={<UserIqamaDataEditMode />}
      onChangeMode={() => {
        handleRefreshIdentityData();
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
