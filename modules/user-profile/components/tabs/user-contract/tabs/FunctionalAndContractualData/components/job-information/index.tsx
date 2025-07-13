import { useFunctionalContractualCxt } from "../../context";
import JobInformationEditMode from "./JobInformationEditMode";
import JobInformationPreviewMode from "./JobInformationPreviewMode";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";
import CanSeeContent from "@/components/shared/CanSeeContent";

export default function JobInformation() {
  const { professionalDataLoading } = useFunctionalContractualCxt();
  const canView = can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.PROFILE_EMPLOYMENT_INFO) as boolean;
  const canUpdate = can(PERMISSION_ACTIONS.UPDATE, PERMISSION_SUBJECTS.PROFILE_EMPLOYMENT_INFO) as boolean;

  return (
    <CanSeeContent canSee={canView}>
      <div className="p-4 flex-grow flex flex-col gap-12">
        <p className="text-lg font-bold">البيانات الوظيفية</p>

        <TabTemplate
          title={"بيانات التوظيف"}
          loading={professionalDataLoading}
          reviewMode={<JobInformationPreviewMode />}
          editMode={<JobInformationEditMode />}
          canEdit={canUpdate}
        />
      </div>
    </CanSeeContent>
  );
}
