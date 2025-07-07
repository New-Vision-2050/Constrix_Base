import UserProfilePersonalDataEditForm from "./edit-mode";
import UserProfilePersonalDataReview from "./preview-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useTranslations } from "next-intl";

export default function PersonalDataSectionPersonalForm() {
  // declare and define component state and vars
  const { userPersonalDataLoading, handleRefreshPersonalData } =
    usePersonalDataTabCxt();
  const t = useTranslations("UserProfile.tabs.CommonSections");

  return (
    <TabTemplate
      title={t("personalData")}
      loading={userPersonalDataLoading}
      reviewMode={<UserProfilePersonalDataReview />}
      editMode={<UserProfilePersonalDataEditForm />}
      onChangeMode={() => {
        handleRefreshPersonalData();
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
