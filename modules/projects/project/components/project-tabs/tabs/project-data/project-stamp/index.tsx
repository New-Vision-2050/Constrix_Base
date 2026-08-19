import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import ProjectStampPreviewMode from "./preview-mode";
import ProjectStampEditMode from "./edit-mode";

export default function ProjectStampSection() {
  return (
    <TabTemplate
      title="اضافة ختم المشروع"
      reviewMode={<ProjectStampPreviewMode />}
      editMode={<ProjectStampEditMode />}
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {}, disabled: true },
          { title: "أنشاء طلب", onClick: () => {}, disabled: true },
        ],
      }}
    />
  );
}
