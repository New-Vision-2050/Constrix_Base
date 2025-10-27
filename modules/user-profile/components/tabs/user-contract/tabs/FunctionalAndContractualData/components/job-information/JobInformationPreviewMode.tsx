import PreviewTextField from "../../../components/previewTextField";
import { useFunctionalContractualCxt } from "../../context";

export default function JobInformationPreviewMode() {
  const { professionalData } = useFunctionalContractualCxt();
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label="الفرع"
          value={professionalData?.branch?.name ?? ""}
          valid={Boolean(professionalData?.branch?.name)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="الادارة"
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
          label="نوع الوظيفة"
          value={professionalData?.job_type?.name ?? ""}
          valid={Boolean(professionalData?.job_type?.name)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="المسمى الوظيفي"
          value={professionalData?.job_title?.name ?? ""}
          valid={Boolean(professionalData?.job_title?.name)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="الرقم الوظيفي"
          value={professionalData?.job_code ?? ""}
          valid={Boolean(professionalData?.job_code)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="المحدد"
          value={professionalData?.attendance_constraint?.constraint_name ?? ""}
          valid={Boolean(professionalData?.attendance_constraint?.constraint_name)}
          required
        />
      </div>
    </div>
  );
}
