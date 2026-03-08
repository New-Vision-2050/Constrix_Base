import { ViewMode } from "../../../publicDocs/components/documents-header";
import GridViewMode from "./GridViewMode";
import ItemDetails from "../../../publicDocs/views/public-docs-tab/ItemDetails";
import { useEmpsDocsCxt } from "../../contexts/emps-docs-cxt";
import { EmpsDocsTable } from "../../components/emps-docs-table";
import DirectoryPasswordDialog from "../../../publicDocs/components/public-docs-table/components/DirectoryPasswordDialog";

type ModeViewsManagerProps = {
  viewMode: ViewMode;
};

export default function ModeViewsManager({ viewMode }: ModeViewsManagerProps) {
  const {
    showItemDetials,
    selectedDocument,
    openDirWithPassword,
    setOpenDirWithPassword,
  } = useEmpsDocsCxt();
  return (
    <div className="w-full min-h-96 bg-sidebar rounded-lg p-4 flex justify-between gap-4">
      <div className="flex-1 min-w-0">
        {viewMode === "grid" ? <GridViewMode /> : <EmpsDocsTable />}
      </div>
      {(showItemDetials || Boolean(selectedDocument)) && (
        <div className="w-[360px] flex-shrink-0">
          <ItemDetails />
        </div>
      )}

      <DirectoryPasswordDialog
        open={openDirWithPassword}
        onClose={() => {
          setOpenDirWithPassword(false);
        }}
      />
    </div>
  );
}
