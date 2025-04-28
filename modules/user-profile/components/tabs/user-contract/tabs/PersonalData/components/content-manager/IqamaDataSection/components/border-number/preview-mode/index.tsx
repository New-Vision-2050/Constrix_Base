import { checkString } from "@/utils/check-string";
import PreviewTextField from "../../../../../../../components/previewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";

export default function UserIqamaBorderNumberPreviewMode() {
  const { userIdentityData } = usePersonalDataTabCxt();

  console.log('check file',userIdentityData?.file_border_number?.[0]?.name,Boolean(userIdentityData?.file_border_number?.[0]?.name))

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          label="رقم الحدود"
          value={checkString(userIdentityData?.border_number as string)}
          valid={Boolean(userIdentityData?.border_number)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ الدخول"
          value={checkString(userIdentityData?.border_number_start_date as string)}
          valid={Boolean(userIdentityData?.border_number_start_date)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ الانتهاء"
          value={checkString(userIdentityData?.border_number_end_date as string)}
          valid={Boolean(userIdentityData?.border_number_end_date)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="ارفاق رقم الحدود"
          value={checkString(userIdentityData?.file_border_number?.[0]?.name as string)}
          valid={Boolean(userIdentityData?.file_border_number?.[0]?.name)}
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
