import ProfileBriefSummaryEdit from "./ProfileBriefSummaryEdit";
import ProfileBriefSummaryPreview from "./ProfileBriefSummaryPreview";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";
import { useTranslations } from "next-intl";

export default function ProfileBriefSummary() {
  // declare and define component state and vars
  const { handleRefetchUserBrief } = useUserAcademicTabsCxt();
  const t = useTranslations("AcademicExperience");
  const tGeneral = useTranslations("GeneralActions");

  return (
    <TabTemplate
      title={t("BriefSummary")}
      reviewMode={<ProfileBriefSummaryPreview />}
      editMode={<ProfileBriefSummaryEdit />}
      onChangeMode={() => {
        handleRefetchUserBrief();
      }}
      settingsBtn={{
        items: [
          { title: tGeneral("MyRequests"), onClick: () => {} },
          { title: tGeneral("CreateRequest"), onClick: () => {} },
        ],
      }}
    />
  );
}
