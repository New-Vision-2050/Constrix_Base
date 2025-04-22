import JobInformationEditMode from "./JobInformationEditMode";
import JobInformationPreviewMode from "./JobInformationPreviewMode";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";
import { useTranslations } from "next-intl";

export default function JobInformation() {
  const t = useTranslations("JobInformation");
  return (
    <div className="p-4 flex-grow flex flex-col gap-12">
      <p className="text-lg font-bold">{t("JobData")}</p>

      <TabTemplate
        title={t("EmploymentData")}
        reviewMode={<JobInformationPreviewMode />}
        editMode={<JobInformationEditMode />}
      />
    </div>
  );
}
