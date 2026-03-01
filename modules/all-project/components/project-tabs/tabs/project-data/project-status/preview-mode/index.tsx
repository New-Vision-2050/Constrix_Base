import PreviewTextField from "@/modules/user-profile/components/tabs/user-contract/tabs/components/previewTextField";

export default function ProjectStatusPreviewMode() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="حالة المشروع"
          value="جاري"
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="نسبة الاعتماد"
          value="10%"
        />
      </div>
    </div>
  );
}

