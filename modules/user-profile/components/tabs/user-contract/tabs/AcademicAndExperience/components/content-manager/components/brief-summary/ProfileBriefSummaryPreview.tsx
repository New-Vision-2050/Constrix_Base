import FormFieldSet from "../../../../../components/FormFieldSet";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";

export default function ProfileBriefSummaryPreview() {
  const { userBrief } = useUserAcademicTabsCxt();
  return (
    <FormFieldSet title={"نبذه عني"}>
      <p className="text-sm text-gray-500">{userBrief?.about_me ?? ""}</p>
    </FormFieldSet>
  );
}
