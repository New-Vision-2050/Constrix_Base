import { TableBuilder } from "@/modules/table";
import { ViewMode } from "../../components/documents-header";
import { getPublicDocsTableConfig } from "../../components/public-docs-table/PublicDocsTableConfig";
import GridViewMode from "./GridViewMode";
import ItemDetails from "./ItemDetails";
import { usePublicDocsCxt } from "../../contexts/public-docs-cxt";

type ModeViewsManagerProps = {
  viewMode: ViewMode;
};

export default function ModeViewsManager({ viewMode }: ModeViewsManagerProps) {
  const { showItemDetials } = usePublicDocsCxt();
  return (
    <div className="w-full min-h-96 bg-sidebar rounded-lg p-4 flex justify-between gap-4">
      <div className="flex-1 min-w-0">
        {viewMode === "grid" ? (
          <GridViewMode />
        ) : (
          <TableBuilder config={getPublicDocsTableConfig()} />
        )}
      </div>
      {showItemDetials && (
        <div className="w-[360px] flex-shrink-0">
          <ItemDetails />
        </div>
      )}
    </div>
  );
}
