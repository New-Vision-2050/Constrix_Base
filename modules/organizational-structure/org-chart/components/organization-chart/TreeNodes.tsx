
import { OrgChartNode } from "@/types/organization";
import { TreeNode } from "react-organizational-chart";
import ChartNode from "./ChartNode";
import { useLocale } from 'next-intl'

interface TreeNodesProps {
  node: OrgChartNode;
  onNodeClick: (node: OrgChartNode) => void;
  selectedNodeId: string | null;
}

const TreeNodes = ({ node, onNodeClick, selectedNodeId }: TreeNodesProps) => {
  const locale = useLocale();
  return (
    <TreeNode label={<ChartNode node={node} onNodeClick={onNodeClick} isSelected={node.id === selectedNodeId} isFirst={!node.children?.length}/>}
              className={`item-${node?.type} ${locale === 'ar'? 'tree-fix-ar': ''}`}>
      {node.children?.map((childNode) => (
        <TreeNodes
          key={childNode.id}
          node={childNode}
          onNodeClick={onNodeClick}
          selectedNodeId={selectedNodeId}
        />
      ))}
    </TreeNode>
  );
};

export default TreeNodes;
