import PreviewTextField from "../../../../../../../components/PreviewTextField";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";

export default function UserAddressSectionPreviewMode() {
  const { userContactData } = useConnectionDataCxt();
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          label="العنوان السكني بمقر العمل / وصف دقيق عنوان وطنى) "
          value={userContactData?.address ?? ""}
          valid={Boolean(userContactData?.address)}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          label="العنوان البريدي"
          value={userContactData?.postal_code ?? ""}
          valid={Boolean(userContactData?.postal_code)}
        />
      </div>
    </div>
  );
}
