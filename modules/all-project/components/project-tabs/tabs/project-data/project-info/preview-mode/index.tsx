"use client";

import PreviewTextField from "@/modules/user-profile/components/tabs/user-contract/tabs/components/previewTextField";
import { useProject } from "@/modules/all-project/context/ProjectContext";

export default function ProjectInfoPreviewMode() {
  const { projectData, isLoading } = useProject();

  const projectName = projectData?.name || "";
  const projectType = projectData?.project_type?.name || "";
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="اسم المشروع"
          value={isLoading ? "..." : projectName}
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="نوع المشروع"
          value={isLoading ? "..." : projectType}
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

