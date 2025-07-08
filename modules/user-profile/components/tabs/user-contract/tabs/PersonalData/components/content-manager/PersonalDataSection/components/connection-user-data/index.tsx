import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import { ConnectionOTPCxtProvider } from "./context/ConnectionOTPCxt";
import UserProfileConnectionDataEditForm from "./edit-mode";
import UserProfileConnectionDataEditForm2 from "./edit-mode-v2";
import UserProfileConnectionDataReview from "./preview-mode";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useTranslations } from "next-intl";

export default function ConnectionDataSectionPersonalForm() {
  // declare and define component state and vars
  const { userConnectionDataLoading } = usePersonalDataTabCxt();
  const t = useTranslations("UserProfile.tabs.CommonSections");

  return (
    <ConnectionOTPCxtProvider>
      <TabTemplate
        title={t("connectionData")}
        loading={userConnectionDataLoading}
        reviewMode={<UserProfileConnectionDataReview />}
        editMode={<UserProfileConnectionDataEditForm2 />}
        settingsBtn={{
          items: [
            { title: t("myRequests"), onClick: () => {} ,disabled:true},
            { title: t("createRequest"), onClick: () => {},disabled:true },
          ],
        }}
      />
    </ConnectionOTPCxtProvider>
  );
}
