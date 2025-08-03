import Can from "@/lib/permissions/client/Can";
import { useFunctionalContractualCxt } from "../../context";
import JobInformationEditMode from "./JobInformationEditMode";
import JobInformationPreviewMode from "./JobInformationPreviewMode";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function JobInformation() {
  const { professionalDataLoading } = useFunctionalContractualCxt();
  return (
    <div className="p-4 flex-grow flex flex-col gap-12">
      <p className="text-lg font-bold">البيانات الوظيفية</p>

      <TabTemplate
        title={"بيانات التوظيف"}
        loading={professionalDataLoading}
        reviewMode={
          <Can check={[PERMISSIONS.profile.jobOffer.view]}>
            <JobInformationPreviewMode />
          </Can>
        }
        editMode={
          <Can check={[PERMISSIONS.profile.jobOffer.update]}>
            <JobInformationEditMode />
          </Can>
        }
      />
    </div>
  );
}
