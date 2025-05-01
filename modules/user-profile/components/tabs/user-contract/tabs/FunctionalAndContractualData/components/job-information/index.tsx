import { useFunctionalContractualCxt } from "../../context";
import JobInformationEditMode from "./JobInformationEditMode";
import JobInformationPreviewMode from "./JobInformationPreviewMode";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";

export default function JobInformation() {
  const { professionalDataLoading } = useFunctionalContractualCxt();
  return (
    <div className="p-4 flex-grow flex flex-col gap-12">
      <p className="text-lg font-bold">البيانات الوظيفية</p>

      <TabTemplate
        title={"بيانات التوظيف"}
        loading={professionalDataLoading}
        reviewMode={<JobInformationPreviewMode />}
        editMode={<JobInformationEditMode />}
      />
    </div>
  );
}
