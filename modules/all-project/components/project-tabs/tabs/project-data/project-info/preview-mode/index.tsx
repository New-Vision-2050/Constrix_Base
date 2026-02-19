import PreviewTextField from "@/modules/user-profile/components/tabs/user-contract/tabs/components/previewTextField";

export default function ProjectInfoPreviewMode() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="اسم المشروع"
          value="مشروع العقد الموحد لشركة الكهرباء"
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="نوع المشروع"
          value="تصميم وتطوير"
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="تخصص المشروع"
          value="برمجة، تصميم، برمجيات"
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="الاستشاري المعتمد"
          value="شركة المشروعات"
        />
      </div>
    </div>
  );
}

