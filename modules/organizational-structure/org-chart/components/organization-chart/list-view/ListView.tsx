import React from "react";
import { OrgChartNode } from "@/types/organization";
import { useListView } from "./useListView";
import ListViewNode from "./ListViewNode";
import ListViewSearch from "./ListViewSearch";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToCSV, prepareOrgDataForExport } from "../utils/exportUtils";
import { DropdownItemT } from "@/components/shared/dropdown-button";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";
import { can } from "@/hooks/useCan";

interface ListViewProps {
  data: OrgChartNode;
  onSelectNode: (node: OrgChartNode) => void;
  selectedNodeId: string | null;
  additionalActions?: React.ReactNode;
  DropDownMenu?: (node: OrgChartNode) => DropdownItemT[];
}

const ListView: React.FC<ListViewProps> = ({
  data,
  onSelectNode,
  selectedNodeId,
  additionalActions,
  DropDownMenu,
}) => {
  const canExport = can(PERMISSION_ACTIONS.EXPORT, PERMISSION_SUBJECTS.ORGANIZATION_MANAGEMENT);
  const {
    expandedNodes,
    expandedDetails,
    visibleNodes,
    searchTerm,
    setSearchTerm,
    toggleNodeExpansion,
    toggleDetailsExpansion,
  } = useListView(data);

  const handleNodeSelection = (node: OrgChartNode) => {
    toggleDetailsExpansion(node);
    onSelectNode(node);
  };

  const handleExport = () => {
    // Prepare the full organizational data for export
    const exportData = prepareOrgDataForExport(data);
    exportToCSV(exportData);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-stretch gap-4 mb-4">
        <div className="flex-1">
          <ListViewSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>
        {/* {additionalActions && <div>{additionalActions}</div>} */}
        {canExport &&   
        <Button
          variant="outline"
          size="sm"
          className="ml-2 h-[43px] whitespace-nowrap "
          onClick={handleExport}
        >
          <Download className="w-4 h-a mr-2 " />
          Export CSV
        </Button>
        }
      </div>

      <div className="overflow-auto">
        {visibleNodes.length > 0 ? (
          visibleNodes.map(({ node, parentName, depth, path }, index) => (
            <ListViewNode
              key={path}
              node={node}
              parentName={parentName}
              depth={depth}
              path={path}
              DropDownMenu={index != 0 ? DropDownMenu : undefined}
              selectedNodeId={selectedNodeId}
              expandedNodes={expandedNodes}
              expandedDetails={expandedDetails}
              onToggleNodeExpansion={toggleNodeExpansion}
              onToggleDetailsExpansion={handleNodeSelection}
            />
          ))
        ) : (
          <div className="h-24 text-center">
            No results found. Try adjusting your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;
