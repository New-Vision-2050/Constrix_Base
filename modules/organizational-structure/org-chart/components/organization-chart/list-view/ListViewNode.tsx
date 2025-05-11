
import React from "react";
import NodeRow from "./NodeRow";
import NodeDetailsRow from "./NodeDetailsRow";
import { OrgChartNode } from "@/types/organization";

interface ListViewNodeProps {
  node: OrgChartNode;
  parentName: string;
  depth: number;
  path: string;
  selectedNodeId: string | null;
  expandedNodes: Set<string>;
  expandedDetails: Set<string>;
  onToggleNodeExpansion: (nodeId: string) => void;
  onToggleDetailsExpansion: (node: OrgChartNode) => void;
}

const ListViewNode: React.FC<ListViewNodeProps> = ({
  node,
  parentName,
  depth,
  path,
  selectedNodeId,
  expandedNodes,
  expandedDetails,
  onToggleNodeExpansion,
  onToggleDetailsExpansion
}) => {
  return (
    <React.Fragment>
      <NodeRow
        node={node}
        parentName={parentName}
        depth={depth}
        path={path}
        selectedNodeId={selectedNodeId}
        isExpanded={expandedNodes.has(node.id?.toString())}
        isDetailsExpanded={expandedDetails.has(node.id?.toString())}
        onToggleExpansion={onToggleNodeExpansion}
        onToggleDetails={() => {
          onToggleDetailsExpansion(node);
        }}
      />
      
      <NodeDetailsRow
        node={node}
        depth={depth}
        isExpanded={expandedDetails.has(node.id?.toString())}
      />
    </React.Fragment>
  );
};

export default ListViewNode;
