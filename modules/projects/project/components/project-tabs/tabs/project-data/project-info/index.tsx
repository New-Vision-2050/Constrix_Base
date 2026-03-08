import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import ProjectInfoPreviewMode from "./preview-mode";
import ProjectInfoEditMode from "./edit-mode";

export default function ProjectInfoSection() {
  return (
    <TabTemplate
      title="بيانات المشروع"
      reviewMode={<ProjectInfoPreviewMode />}
      editMode={<ProjectInfoEditMode />}
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {}, disabled: true },
          { title: "أنشاء طلب", onClick: () => {}, disabled: true },
        ],
      }}
    />
  );
}

