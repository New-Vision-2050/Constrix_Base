import PreviewTextField from "../../../../../../components/PreviewTextField";

export default function SingleCoursePreviewMode() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField label="اسم الشركة" value="اسم الشركة" valid={false} />
      </div>

      <div className="p-2">
        <PreviewTextField label="الجهة" value="الجهة" valid={false} />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="اسم الدورة التدريبية "
          value="اسم الدورة التدريبية "
          valid={false}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="جهة الاعتماد"
          value="جهة الاعتماد"
          valid={false}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="الشهادات الممنوحة"
          value="الشهادات الممنوحة"
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
