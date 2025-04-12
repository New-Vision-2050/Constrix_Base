import PreviewTextField from "../../../../../../../components/PreviewTextField";

export default function MaritalStatusRelativesSectionPreviewMode() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row one columns*/}
      <div className="p-2 col-span-2">
        <PreviewTextField
          valid={true}
          label="الحالة الاجتماعية"
          value=""
          isSelect
        />
      </div>
      {/* two row 2 columns*/}
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="اسم شخص في حالة الطواري"
          value=""
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="علاقة الشخص بحاله الطواري"
          value=""
        />
      </div>
      {/* third row one columns*/}
      <div className="p-2 col-span-2">
        <PreviewTextField
          valid={true}
          label=" رقم الهاتف الخاص بجهة اتصال في حالة الطوارئ"
          value=""
        />
      </div>
    </div>
  );
}
