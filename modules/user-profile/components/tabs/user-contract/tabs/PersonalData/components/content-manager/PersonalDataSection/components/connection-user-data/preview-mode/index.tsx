import PreviewTextField from "../../../../../../../components/previewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";

export default function UserProfileConnectionDataReview() {
  const { userConnectionData } = usePersonalDataTabCxt();
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userConnectionData?.phone)}
          label="رقم الجوال"
          value={userConnectionData?.phone ?? ""}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userConnectionData?.email)}
          label="البريد الالكتروني"
          value={userConnectionData?.email ?? ""}
        />
      </div>
    </div>
  );
}
