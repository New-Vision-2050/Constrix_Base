import { TableBuilder } from "@/modules/table";
import { ViewMode } from "../../components/documents-header";
import { getPublicDocsTableConfig } from "../../components/public-docs-table/PublicDocsTableConfig";
import GridViewMode from "./GridViewMode";

type ModeViewsManagerProps = {
  viewMode: ViewMode;
};

export default function ModeViewsManager({ viewMode }: ModeViewsManagerProps) {
  return (
    <div>
      {viewMode === "grid" ? (
        <GridViewMode />
      ) : (
        <TableBuilder config={getPublicDocsTableConfig()} />
      )}
    </div>
  );
}
