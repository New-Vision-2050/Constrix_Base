import PreviewTextField from "../../../../../../../components/previewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";

export default function UserProfilePassportDataReview() {
  const { userIdentityData } = usePersonalDataTabCxt();

  console.log("userIdentityData", userIdentityData);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userIdentityData?.passport)}
          label="رقم جواز السفر"
          value={userIdentityData?.passport ?? ""}
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userIdentityData?.passport_start_date)}
          label="تاريخ الانشاء"
          value={userIdentityData?.passport_start_date ?? ""}
          required
          type="date"
        />
      </div>

      {/* second row */}
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userIdentityData?.passport_end_date)}
          label="تاريخ الانتهاء"
          value={userIdentityData?.passport_end_date ?? ""}
          type="date"
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userIdentityData?.file_passport?.[0]?.url)}
          label="ارفاق الهوية"
          value={userIdentityData?.file_passport?.[0]?.name ?? "-"}
          type={
            userIdentityData?.file_passport?.[0]?.type == "image"
              ? "image"
              : "pdf"
          }
          fileUrl={userIdentityData?.file_passport?.[0]?.url}
        />
      </div>
    </div>
  );
}
