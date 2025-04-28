import PreviewTextField from "../../../../../../../components/previewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";

export default function UserIqamaDataPreviewMode() {
  const { userIdentityData } = usePersonalDataTabCxt();

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          label="رقم الاقامة"
          value={userIdentityData?.entry_number ?? ""}
          valid={Boolean(userIdentityData?.entry_number)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ الاصدار"
          value={userIdentityData?.entry_number_start_date ?? ""}
          valid={Boolean(userIdentityData?.entry_number_start_date)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ الانتهاء"
          value={userIdentityData?.entry_number_end_date ?? ""}
          valid={Boolean(userIdentityData?.entry_number_end_date)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userIdentityData?.file_entry_number?.[0]?.url)}
          label="ارفاق الهوية"
          value={userIdentityData?.file_entry_number?.[0]?.name ?? "-"}
          type={
            userIdentityData?.file_entry_number?.[0]?.type == "image"
              ? "image"
              : "pdf"
          }
          fileUrl={userIdentityData?.file_entry_number?.[0]?.url}
        />
      </div>
    </div>
  );
}
