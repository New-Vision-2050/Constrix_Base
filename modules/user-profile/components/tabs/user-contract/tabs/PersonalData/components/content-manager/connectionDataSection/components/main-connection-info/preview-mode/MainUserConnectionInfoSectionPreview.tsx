import PreviewTextField from "../../../../../../../components/PreviewTextField";

export default function MainUserConnectionInfoSectionPreview() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="البريد الالكتروني"
          value="Mohamed@gmail.com"
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="رقم الجوال"
          value="+966 0554856200"
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="رقم جوال بديل"
          value="02456145255"
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="رقم الهاتف الأرضي"
          value="023145255"
        />
      </div>
    </div>
  );
}
