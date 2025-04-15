import PreviewTextField from "../../../../../../components/PreviewTextField";

export default function UserCertificationPreview() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label="اسم الجهة"
          value="الهيئة السعودية للمهندسين"
          valid={true}
          isSelect
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="اسم الاعتماد"
          value="اسم الاعتماد"
          valid={false}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="رقم الاعتماد"
          value="رقم الاعتماد"
          valid={true}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="درجة الاعتماد"
          value="درجة الاعتماد"
          valid={false}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ الحصول على الشهادة"
          value="تاريخ الحصول على الشهادة"
          valid={false}
          isDate
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ انتهاء الشهادة"
          value="تاريخ انتهاء الشهادة"
          valid={false}
          isDate
        />
      </div>
    </div>
  );
}
