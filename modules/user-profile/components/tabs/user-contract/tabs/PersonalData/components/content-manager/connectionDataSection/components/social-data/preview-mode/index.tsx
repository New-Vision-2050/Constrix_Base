import PreviewTextField from "../../../../../../../components/PreviewTextField";

export default function SocialDataSectionPreviewMode() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField valid={true} label="واتساب " value="02456145255" />
      </div>
      <div className="p-2">
        <PreviewTextField valid={true} label="فيسبوك" value="" />
      </div>
      <div className="p-2">
        <PreviewTextField valid={true} label="تيليجرام" value="" />
      </div>
      <div className="p-2">
        <PreviewTextField valid={true} label="انستقرام" value="" />
      </div>
      <div className="p-2">
        <PreviewTextField valid={true} label="سناب شات" value="" />
      </div>
      <div className="p-2">
        <PreviewTextField valid={true} label="لينك اند" value="" />
      </div>
    </div>
  );
}
