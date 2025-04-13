import PreviewTextField from "../../../../../../../components/PreviewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";

export default function UserProfileConnectionDataReview() {
  const { userConnectionData } = usePersonalDataTabCxt();
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="رقم الجوال"
          value={userConnectionData?.phone ?? ""}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="البريد الالكتروني"
          value={userConnectionData?.email ?? ""}
        />
      </div>
    </div>
  );
}
