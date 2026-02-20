import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import ProjectStatusPreviewMode from "./preview-mode";
import ProjectStatusEditMode from "./edit-mode";

export default function ProjectStatusSection() {
  return (
    <TabTemplate
      title="حالة المشروع"
      reviewMode={<ProjectStatusPreviewMode />}
      editMode={<ProjectStatusEditMode />}
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {}, disabled: true },
          { title: "أنشاء طلب", onClick: () => {}, disabled: true },
        ],
      }}
    />
  );
}

