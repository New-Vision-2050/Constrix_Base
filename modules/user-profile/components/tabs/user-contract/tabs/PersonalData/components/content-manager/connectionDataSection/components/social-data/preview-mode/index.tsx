import PreviewTextField from "../../../../../../../components/previewTextField";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";

// Function to convert phone number to WhatsApp chat link
const formatWhatsappLink = (phoneNumber: string | undefined): string => {
  if (!phoneNumber) return "";
  
  // Remove any non-numeric symbols from phone number
  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, "");
  
  // Remove the + from the beginning if present
  const formattedNumber = cleanNumber.startsWith("+") ? cleanNumber.substring(1) : cleanNumber;
  
  // Create WhatsApp link
  return `https://wa.me/${formattedNumber}`;
};

// Function to display phone number with "Chat:" text
const formatWhatsappDisplay = (phoneNumber: string | undefined): string => {
  if (!phoneNumber) return "";
  
  // Clean phone number from any non-numeric symbols
  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, "");
  
  return `Chat:${cleanNumber}`;
};

export default function SocialDataSectionPreviewMode() {
  const { userSocialData } = useConnectionDataCxt();
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userSocialData?.whatsapp)}
          label="واتساب "
          value={formatWhatsappLink(userSocialData?.whatsapp)}
          displayText={formatWhatsappDisplay(userSocialData?.whatsapp)}
          type="link"
          openInNewTab={true}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userSocialData?.facebook)}
          label="فيسبوك"
          value={userSocialData?.facebook ?? ""}
          type="link"
          openInNewTab={true}
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
          type="link"
          openInNewTab={true}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userSocialData?.snapchat)}
          label="سناب شات"
          value={userSocialData?.snapchat ?? ""}
          type="link"
          openInNewTab={true}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userSocialData?.linkedin)}
          label="لينك اند"
          value={userSocialData?.linkedin ?? ""}
          type="link"
          openInNewTab={true}
        />
      </div>
    </div>
  );
}
