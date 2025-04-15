import PreviewTextField from "../../../../../../components/PreviewTextField";

export default function SingleExperiencePreviewMode() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label="المسمى الوظيفي"
          value="المسمى الوظيفي"
          valid={true}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="حدد فترة التدريب"
          value="حدد فترة التدريب"
          valid={true}
          isDate
        />
      </div>

      <div className="p-2">
        <PreviewTextField label="اسم الشركة" value="اسم الشركة" valid={true} />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="نبذه عن المشاريع والاعمال"
          value="نبذه عن المشاريع والاعمال"
          valid={false}
        />
      </div>
    </div>
  );
}
