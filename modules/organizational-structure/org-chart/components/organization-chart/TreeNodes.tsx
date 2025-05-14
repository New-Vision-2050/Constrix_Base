import { OrgChartNode } from "@/types/organization";
import { TreeNode } from "react-organizational-chart";
import ChartNode from "./ChartNode";
import { useLocale } from "next-intl";
import OrgChartAddButton from "./chart-add-button";

interface TreeNodesProps {
  node: OrgChartNode;
  onNodeClick: (node: OrgChartNode) => void;
  selectedNodeId: string | null;
  onAddBtnClick?: (node: OrgChartNode) => void;
  onEditBtnClick?: (node: OrgChartNode) => void;
  handleDeleteManagement?: (id: string | number) => Promise<void>
}

const TreeNodes = ({
  node,
  onNodeClick,
  selectedNodeId,
  onAddBtnClick,
  onEditBtnClick,
  handleDeleteManagement
}: TreeNodesProps) => {
  const locale = useLocale();
  return (
    <TreeNode
      label={
        <div
          className={`flex flex-col items-center item-${
            node.children?.length === 1 ? node.children[0]?.type : node?.type
          }`}
        >
          <ChartNode
            node={node}
            onNodeClick={onNodeClick}
            isSelected={node.id === selectedNodeId}
            isFirst={!node.children?.length}
            onEditBtnClick={onEditBtnClick}
            handleDeleteManagement={handleDeleteManagement}
          />
          <OrgChartAddButton node={node} onAddBtnClick={onAddBtnClick} />
        </div>
      }
      className={`item-${node?.type} ${locale === "ar" ? "tree-fix-ar" : ""}`}
    >
      {node.children?.map((childNode) => (
        <TreeNodes
          key={childNode.id}
          node={childNode}
          onNodeClick={onNodeClick}
          selectedNodeId={selectedNodeId}
          onEditBtnClick={onEditBtnClick}
          handleDeleteManagement={handleDeleteManagement}
          onAddBtnClick={onAddBtnClick}
        />
      ))}
    </TreeNode>
  );
};

export default TreeNodes;
