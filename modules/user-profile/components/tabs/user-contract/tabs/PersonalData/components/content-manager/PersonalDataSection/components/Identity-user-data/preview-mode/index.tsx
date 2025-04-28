import PreviewTextField from "../../../../../../../components/previewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";

export default function UserProfileIdentityDataReview() {
  const { userIdentityData } = usePersonalDataTabCxt();

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userIdentityData?.identity)}
          label="رقم الهوية"
          value={userIdentityData?.identity ?? ""}
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userIdentityData?.identity_start_date)}
          label="تاريخ الدخول"
          value={userIdentityData?.identity_start_date ?? ""}
          required
          type="date"
        />
      </div>

      {/* second row */}
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userIdentityData?.identity_end_date)}
          label="تاريخ الانتهاء"
          value={userIdentityData?.identity_end_date ?? ""}
          type="date"
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userIdentityData?.file_identity?.[0]?.url)}
          label="ارفاق الهوية"
          value={userIdentityData?.file_identity?.[0]?.name ?? "-"}
          type={
            userIdentityData?.file_identity?.[0]?.type == "image"
              ? "image"
              : "pdf"
          }
          fileUrl={userIdentityData?.file_identity?.[0]?.url}
        />
      </div>
    </div>
  );
}
