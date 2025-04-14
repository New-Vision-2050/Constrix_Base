import PreviewTextField from "../../../../../../components/PreviewTextField";

export default function SingleQualificationDataPreview() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="دولة التخرج"
          value="المملكة العربية السعودية"
          isSelect
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="الجامعة"
          value="جامعة الملك فهد"
          isSelect
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="المؤهل"
          value="بكالوريوس"
          isSelect
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="التخصص الأكاديمي"
          value="هندسة معماري"
          isSelect
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="تاريخ الحصول على الشهادة"
          value="25-07-2013"
          isDate
        />
      </div>

      <div className="p-2">
        <PreviewTextField valid={true} label="المعدلات الدراسية " value="83%" isSelect />
      </div>

      <div className="p-2">
        <PreviewTextField valid={true} label="ارفاق شهادة" value="ملف_2024" isPdf />
      </div>
    </div>
  );
}
