import { useTranslations } from "next-intl";
import FormFieldSet from "../../../../../components/FormFieldSet";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";

export default function ProfileBriefSummaryPreview() {
  const { userBrief } = useUserAcademicTabsCxt();
  const t = useTranslations("UserProfile.nestedTabs.briefSummary");
  return (
    <FormFieldSet title={t("aboutMe")}>
      <p className="text-sm text-gray-500">{userBrief?.about_me ?? ""}</p>
    </FormFieldSet>
  );
}
