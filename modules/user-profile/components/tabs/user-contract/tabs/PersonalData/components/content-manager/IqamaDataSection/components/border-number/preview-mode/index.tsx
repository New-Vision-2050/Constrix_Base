import PreviewTextField from "../../../../../../../components/previewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";

export default function UserIqamaBorderNumberPreviewMode() {
  const { userIdentityData } = usePersonalDataTabCxt();

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          label="رقم الحدود"
          value={userIdentityData?.border_number ?? ""}
          valid={Boolean(userIdentityData?.border_number)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ الدخول"
          value={userIdentityData?.border_number_start_date ?? ""}
          valid={Boolean(userIdentityData?.border_number_start_date)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ الانتهاء"
          value={userIdentityData?.border_number_end_date ?? ""}
          valid={Boolean(userIdentityData?.border_number_end_date)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userIdentityData?.file_border_number?.[0]?.url)}
          label="ارفاق الهوية"
          value={userIdentityData?.file_border_number?.[0]?.name ?? ""}
          type={
            userIdentityData?.file_border_number?.[0]?.type == "image"
              ? "image"
              : "pdf"
          }
          fileUrl={userIdentityData?.file_border_number?.[0]?.url}
        />
      </div>
    </div>
  );
}
