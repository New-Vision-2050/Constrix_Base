import PreviewTextField from "../../../../../../../components/PreviewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";

export default function UserProfileIdentityDataReview() {
  const { userIdentityData } = usePersonalDataTabCxt();
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="رقم الهوية"
          value={userIdentityData?.identity ?? ""}
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="تاريخ الدخول"
          value={userIdentityData?.identity_start_date ?? ""}
          required
          isDate
        />
      </div>

      {/* second row */}
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="تاريخ الانتهاء"
          value={userIdentityData?.identity_end_date ?? ""}
          isDate
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="ارفاق الهوية"
          value={"identity_2024.pdf"}
          isPdf
        />
      </div>
    </div>
  );
}
