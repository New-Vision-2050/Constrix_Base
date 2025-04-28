import PreviewTextField from "../../../../../../../components/previewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";

export default function UserProfilePassportDataReview() {
  const { userIdentityData, handleRefreshIdentityData } =
    usePersonalDataTabCxt();

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
      {Array.isArray(userIdentityData?.file_passport) &&
        userIdentityData?.file_passport?.map((media) => (
          <div key={media.id} className="p-2">
            <PreviewTextField
              mediaId={media?.id}
              fireAfterDeleteMedia={() => {
                handleRefreshIdentityData();
              }}
              valid={Boolean(media?.name)}
              label="ارفاق الهوية"
              value={media?.name ?? "---"}
              type={media?.type == "image" ? "image" : "pdf"}
              fileUrl={media?.url}
            />
          </div>
        ))}
    </div>
  );
}
