import FormFieldSet from "../../../../../components/FormFieldSet";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import { useTranslations } from "next-intl";

export default function ProfileBriefSummaryPreview() {
  const { userBrief } = useUserAcademicTabsCxt();
  const t = useTranslations("AcademicExperience");
  return (
    <FormFieldSet title={t("AboutMe")}>
      <p className="text-sm text-gray-500">{userBrief?.about_me ?? ""}</p>
    </FormFieldSet>
  );
}
