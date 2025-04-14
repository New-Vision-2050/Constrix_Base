import PreviewTextField from "../../../../../../../components/PreviewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";

export default function UserProfilePassportDataReview() {
  const { userIdentityData } = usePersonalDataTabCxt();

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="رقم جواز السفر"
          value={userIdentityData?.passport ?? ""}
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="تاريخ الانشاء"
          value={userIdentityData?.passport_start_date ?? ""}
          required
          isDate
        />
      </div>

      {/* second row */}
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="تاريخ الانتهاء"
          value={userIdentityData?.passport_end_date ?? ""}
          isDate
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="ارفاق الهوية"
          value={
            userIdentityData?.file_passport ?? "passport_attached_file.pdf"
          }
          isPdf
        />
      </div>
    </div>
  );
}
