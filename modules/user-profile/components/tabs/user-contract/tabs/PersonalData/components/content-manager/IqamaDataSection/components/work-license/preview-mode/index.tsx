import PreviewTextField from "../../../../../../../components/previewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";

export default function UserIqamaWorkLicenseDataPreviewMode() {
  const { userIdentityData, handleRefreshIdentityData } =
    usePersonalDataTabCxt();

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          required
          label="رقم رخصة العمل"
          value={userIdentityData?.work_permit ?? ""}
          valid={Boolean(userIdentityData?.work_permit)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ الدخول"
          value={userIdentityData?.work_permit_start_date ?? ""}
          valid={Boolean(userIdentityData?.work_permit_start_date)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          required
          label="تاريخ الانتهاء"
          value={userIdentityData?.work_permit_end_date ?? ""}
          valid={Boolean(userIdentityData?.work_permit_end_date)}
          type="date"
        />
      </div>

      {Array.isArray(userIdentityData?.file_work_permit) &&
      userIdentityData?.file_work_permit?.length > 0 ? (
        userIdentityData?.file_work_permit?.map((media) => (
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
        ))
      ) : (
        <div className="p-2">
          <PreviewTextField
            valid={false}
            label="ارفاق الهوية"
            value={"---"}
            type={"pdf"}
          />
        </div>
      )}
    </div>
  );
}
