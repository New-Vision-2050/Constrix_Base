import PreviewTextField from "../../../../../../../components/PreviewTextField";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";

export default function MainUserConnectionInfoSectionPreview() {
  const { userContactData } = useConnectionDataCxt();
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          label="البريد الالكتروني"
          valid={Boolean(userContactData?.email)}
          value={userContactData?.email ?? ""}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label="رقم الجوال"
          valid={Boolean(userContactData?.phone)}
          value={userContactData?.phone ?? ""}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label="رقم جوال بديل"
          valid={Boolean(userContactData?.other_phone)}
          value={userContactData?.other_phone ?? ""}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label="رقم الهاتف الأرضي"
          valid={Boolean(userContactData?.landline_number)}
          value={userContactData?.landline_number ?? ""}
        />
      </div>
    </div>
  );
}
