import PreviewTextField from "../../../../../../../components/previewTextField";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";

export default function SocialDataSectionPreviewMode() {
  const { userSocialData } = useConnectionDataCxt();
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userSocialData?.whatsapp)}
          label="واتساب "
          value={userSocialData?.whatsapp ?? ""}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userSocialData?.facebook)}
          label="فيسبوك"
          value={userSocialData?.facebook ?? ""}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userSocialData?.telegram)}
          label="تيليجرام"
          value={userSocialData?.telegram ?? ""}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userSocialData?.instagram)}
          label="انستقرام"
          value={userSocialData?.instagram ?? ""}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userSocialData?.snapchat)}
          label="سناب شات"
          value={userSocialData?.snapchat ?? ""}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userSocialData?.linkedin)}
          label="لينك اند"
          value={userSocialData?.linkedin ?? ""}
        />
      </div>
    </div>
  );
}
