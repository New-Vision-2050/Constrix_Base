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
          label="ارفاق رقم الاقامة"
          value={
            Boolean(userIdentityData?.file_entry_number?.url) ? "رقم الاقامة" : ""
          }
          valid={Boolean(userIdentityData?.file_entry_number?.url)}
          type="pdf"
          fileUrl={userIdentityData?.file_entry_number?.url}
        />
      </div>
    </div>
  );
}
