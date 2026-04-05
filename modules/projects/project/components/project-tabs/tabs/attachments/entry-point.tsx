"use client";

import { useState } from "react";
import ProjectAttachmentsDocumentsHeader from "./components/documents-header/ProjectAttachmentsDocumentsHeader";
import ProjectAttachmentsSearchFields from "./components/search-fields/ProjectAttachmentsSearchFields";
import ProjectModeViewsManager from "./ProjectModeViewsManager";
import ProjectBranchesList from "./ProjectBranchesList";
import { useProjectAttachmentsCxt } from "./context/project-attachments-cxt";
import ProjectVisitedDirsList from "./ProjectVisitedDirsList";
import ProjectDocViewDialog from "./dialogs/ProjectDocViewDialog";
import type { ViewMode } from "./components/documents-header/types";

export default function ProjectAttachmentsEntryPoint() {
  const {
    clearSelectedDocs,
    storeSelectedDocument,
    searchData,
    setSearchData,
    tableParams,
  } = useProjectAttachmentsCxt();
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const handleViewModeChange = (mode: ViewMode) => {
    storeSelectedDocument(undefined);
    clearSelectedDocs();
    setViewMode(mode);
  };

  return (
    <div className="space-y-4">
      <ProjectAttachmentsSearchFields
        data={searchData}
        onChange={setSearchData}
        isLoading={false}
      />
      <ProjectAttachmentsDocumentsHeader
        searchValue={tableParams.search}
        onSearchChange={tableParams.setSearch}
        onAddClick={() => {}}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        isLoading={false}
      />
      <ProjectBranchesList />
      <ProjectVisitedDirsList />
      <ProjectModeViewsManager viewMode={viewMode} />
      <ProjectDocViewDialog />
    </div>
  );
}
