import PreviewTextField from "../../../components/previewTextField";
import { useFunctionalContractualCxt } from "../../context";
import { useTranslations } from "next-intl";

export default function JobInformationPreviewMode() {
  const { professionalData } = useFunctionalContractualCxt();
  const tJobData = useTranslations("UserProfile.nestedTabs.jobData");
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label={tJobData("branch")}
          value={professionalData?.branch?.name ?? ""}
          valid={Boolean(professionalData?.branch?.name)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={tJobData("management")}
          value={professionalData?.management?.name ?? ""}
          valid={Boolean(professionalData?.management?.name)}
          required
        />
      </div>

      {/* <div className="p-2">
        <PreviewTextField
          label="القسم"
          value={professionalData?.department?.name ?? ""}
          valid={Boolean(professionalData?.department?.name)}
          required
        />
      </div> */}

      <div className="p-2">
        <PreviewTextField
          label={tJobData("jobType")}
          value={professionalData?.job_type?.name ?? ""}
          valid={Boolean(professionalData?.job_type?.name)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={tJobData("jobTitle")}
          value={professionalData?.job_title?.name ?? ""}
          valid={Boolean(professionalData?.job_title?.name)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={tJobData("jobCode")}
          value={professionalData?.job_code ?? ""}
          valid={Boolean(professionalData?.job_code)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={tJobData("attendanceConstraint")}
          value={professionalData?.attendance_constraint?.constraint_name ?? ""}
          valid={Boolean(professionalData?.attendance_constraint?.constraint_name)}
          required
        />
      </div>
      
      <div className="p-2">
        <PreviewTextField
          label={tJobData("roles")}
          value={professionalData?.roles?.join(", ") ?? ""}
          valid={Boolean(professionalData?.roles?.length)}
          required
        />
      </div>
    </div>
  );
}
