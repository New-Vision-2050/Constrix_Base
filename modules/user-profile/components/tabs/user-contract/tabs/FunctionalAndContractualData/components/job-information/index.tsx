import JobInformationEditMode from "./JobInformationEditMode";
import JobInformationPreviewMode from "./JobInformationPreviewMode";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";

export default function JobInformation() {
  return (
    <div className="p-4 flex-grow flex flex-col gap-12">
      <p className="text-lg font-bold">البيانات الوظيفية</p>

      <TabTemplate
        title={"بيانات التوظيف"}
        reviewMode={<JobInformationPreviewMode />}
        editMode={<JobInformationEditMode />}
      />
    </div>
  );
}
