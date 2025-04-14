import PreviewTextField from "../../../../../../../components/PreviewTextField";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";

export default function SocialDataSectionPreviewMode() {
  const { userSocialData } = useConnectionDataCxt();
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="واتساب "
          value={userSocialData?.whatsapp ?? ""}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="فيسبوك"
          value={userSocialData?.facebook ?? ""}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="تيليجرام"
          value={userSocialData?.telegram ?? ""}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="انستقرام"
          value={userSocialData?.instagram ?? ""}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="سناب شات"
          value={userSocialData?.snapchat ?? ""}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="لينك اند"
          value={userSocialData?.linkedin ?? ""}
        />
      </div>
    </div>
  );
}
