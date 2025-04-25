import PreviewTextField from "../../../../../../../components/previewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";

export default function UserIqamaWorkLicenseDataPreviewMode() {
  const { userIdentityData } = usePersonalDataTabCxt();
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          label="رقم رخصة العمل"
          value={userIdentityData?.work_permit??''}
          valid={Boolean(userIdentityData?.work_permit)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ الدخول"
          value={userIdentityData?.work_permit_start_date??''}
          valid={Boolean(userIdentityData?.work_permit_start_date)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ الانتهاء"
          value={userIdentityData?.work_permit_end_date??''}
          valid={Boolean(userIdentityData?.work_permit_end_date)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="ارفاق رخصة العمل"
          value={userIdentityData?.file_work_permit?.url ? 'رخصة العمل pdf' :''}
          valid={Boolean(userIdentityData?.file_work_permit?.url)}
          type="pdf"
          fileUrl={userIdentityData?.file_work_permit?.url}
        />
      </div>
    </div>
  );
}
