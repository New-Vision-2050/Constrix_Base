import PreviewTextField from "@/modules/user-profile/components/tabs/user-contract/tabs/components/previewTextField";

export default function ProjectDetailsPreviewMode() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="مدير المشروع"
          value="احمد خالد"
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="الطاقة السوقية"
          value="100,000 ريال"
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="تاريخ العقد"
          value="01/01/2024"
          type="date"
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="تاريخ التسليم"
          value="30/09/2025"
          type="date"
        />
      </div>
    </div>
  );
}

