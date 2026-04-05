import type { ViewMode } from "./components/documents-header/types";
import ProjectAttachmentsGridView from "./components/grid/ProjectAttachmentsGridView";
import ProjectItemDetails from "./item-details";
import { useProjectAttachmentsCxt } from "./context/project-attachments-cxt";
import ProjectAttachmentsHeadlessTable from "./components/table/ProjectAttachmentsHeadlessTable";
import ProjectDirectoryPasswordDialog from "./dialogs/ProjectDirectoryPasswordDialog";

type ProjectModeViewsManagerProps = {
  viewMode: ViewMode;
};

export default function ProjectModeViewsManager({
  viewMode,
}: ProjectModeViewsManagerProps) {
  const {
    showItemDetials,
    selectedDocument,
    openDirWithPassword,
    setOpenDirWithPassword,
  } = useProjectAttachmentsCxt();

  return (
    <div className="w-full min-h-96 bg-sidebar rounded-lg p-4 flex justify-between gap-4">
      <div className="flex-1 min-w-0">
        {viewMode === "grid" ? (
          <ProjectAttachmentsGridView />
        ) : (
          <ProjectAttachmentsHeadlessTable />
        )}
      </div>
      {(showItemDetials || Boolean(selectedDocument)) && (
        <div className="w-[360px] flex-shrink-0">
          <ProjectItemDetails />
        </div>
      )}

      <ProjectDirectoryPasswordDialog
        open={openDirWithPassword}
        onClose={() => {
          setOpenDirWithPassword(false);
        }}
      />
    </div>
  );
}
