"use client";

import PreviewTextField from "@/modules/user-profile/components/tabs/user-contract/tabs/components/previewTextField";
import { useProject } from "@/modules/all-project/context/ProjectContext";

export default function ProjectDetailsPreviewMode() {
  const { projectData, isLoading } = useProject();

  const managerName = projectData?.manager?.name || "غير محدد";

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="مدير المشروع"
          value={isLoading ? "..." : managerName}
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

