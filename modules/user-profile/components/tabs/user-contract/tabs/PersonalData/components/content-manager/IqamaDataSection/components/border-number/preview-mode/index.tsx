import PreviewTextField from "../../../../../../../components/PreviewTextField";
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
          isDate
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ الانتهاء"
          value={userIdentityData?.border_number_end_date ?? ""}
          valid={Boolean(userIdentityData?.border_number_end_date)}
          isDate
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="ارفاق رقم الحدود"
          value={userIdentityData?.file_border_number ? "رقم الحدود" : ""}
          valid={Boolean(userIdentityData?.file_border_number)}
          isPdf
        />
      </div>
    </div>
  );
}
