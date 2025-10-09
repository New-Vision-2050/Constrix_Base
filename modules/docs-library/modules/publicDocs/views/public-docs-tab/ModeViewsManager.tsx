import { ViewMode } from "../../components/documents-header";
import GridViewMode from "./GridViewMode";
import ItemDetails from "./ItemDetails";
import { usePublicDocsCxt } from "../../contexts/public-docs-cxt";
import { PublicDocsTable } from "../../components/public-docs-table";
import DirectoryPasswordDialog from "../../components/public-docs-table/components/DirectoryPasswordDialog";

type ModeViewsManagerProps = {
  viewMode: ViewMode;
};

export default function ModeViewsManager({ viewMode }: ModeViewsManagerProps) {
  const {
    showItemDetials,
    selectedDocument,
    openDirWithPassword,
    setOpenDirWithPassword,
  } = usePublicDocsCxt();
  return (
    <div className="w-full min-h-96 bg-sidebar rounded-lg p-4 flex justify-between gap-4">
      <div className="flex-1 min-w-0">
        {viewMode === "grid" ? <GridViewMode /> : <PublicDocsTable />}
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
