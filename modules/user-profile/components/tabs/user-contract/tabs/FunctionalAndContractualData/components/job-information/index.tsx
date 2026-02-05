import Can from "@/lib/permissions/client/Can";
import { useFunctionalContractualCxt } from "../../context";
import JobInformationEditMode from "./JobInformationEditMode";
import JobInformationPreviewMode from "./JobInformationPreviewMode";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

export default function JobInformation() {
  const { professionalDataLoading } = useFunctionalContractualCxt();
  const { can } = usePermissions();

  return (
    <Can check={[PERMISSIONS.profile.employmentInfo.view]}>
      <div className="p-4 flex-grow flex flex-col gap-12">
        <p className="text-lg font-bold">البيانات الوظيفية</p>
        <TabTemplate
          title={"بيانات التوظيف"}
          loading={professionalDataLoading}
          reviewMode={<JobInformationPreviewMode />}
          editMode={<JobInformationEditMode />}
          settingsBtn={{
            items: [],
            disabledEdit: !can([PERMISSIONS.profile.employmentInfo.update]),
            
          }}
        />
      </div>
    </Can>
  );
}
