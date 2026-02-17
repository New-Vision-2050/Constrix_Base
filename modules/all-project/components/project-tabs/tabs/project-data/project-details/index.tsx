import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import ProjectDetailsPreviewMode from "./preview-mode";
import ProjectDetailsEditMode from "./edit-mode";

export default function ProjectDetailsSection() {
  return (
    <TabTemplate
      title="تفاصيل المشروع"
      reviewMode={<ProjectDetailsPreviewMode />}
      editMode={<ProjectDetailsEditMode />}
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {}, disabled: true },
          { title: "أنشاء طلب", onClick: () => {}, disabled: true },
        ],
      }}
    />
  );
}

