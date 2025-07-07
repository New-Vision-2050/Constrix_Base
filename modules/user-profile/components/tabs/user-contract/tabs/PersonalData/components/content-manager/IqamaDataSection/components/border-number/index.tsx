import UserIqamaBorderNumberPreviewMode from "./preview-mode";
import UserIqamaBorderNumberEditMode from "./edit-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useTranslations } from "next-intl";

export default function UserIqamaBorderNumber() {
  // declare and define component state and vars
  const { handleRefreshIdentityData, userIdentityDataLoading } =
    usePersonalDataTabCxt();
  const t = useTranslations("UserProfile.tabs.CommonSections");

  return (
    <TabTemplate
      title={t("borderNumberData")}
      loading={userIdentityDataLoading}
      reviewMode={<UserIqamaBorderNumberPreviewMode />}
      editMode={<UserIqamaBorderNumberEditMode />}
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
