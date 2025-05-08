import { OrgChartNode } from '@/types/organization'
import { TreeNode } from 'react-organizational-chart'
import ChartNode from './ChartNode'
import { useLocale } from 'next-intl'
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";


interface TreeNodesProps {
  node: OrgChartNode;
  onNodeClick: (node: OrgChartNode) => void;
  selectedNodeId: string | null;
}

const TreeNodes = ({ node, onNodeClick, selectedNodeId }: TreeNodesProps) => {
  const locale = useLocale()
  return (
    <TreeNode label={
      <div className={`flex flex-col items-center item-${node.children?.length === 1 ? node.children[0]?.type:node?.type}`}>
      <ChartNode node={node} onNodeClick={onNodeClick} isSelected={node.id === selectedNodeId}
                 isFirst={!node.children?.length}/>
        {node.children?.length > 0 && (
          <div className="relative w-full h-8">
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 rounded-full bg-white hover:bg-blue-50"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Add new node under:', node.id);
                }}
              >
                <Plus className="h-4 w-4 text-primary" />
              </Button>
            </div>
          </div>
        )}
      </div>
    }
              className={`item-${node?.type} ${locale === 'ar' ? 'tree-fix-ar' : ''}`}>
      {node.children?.map((childNode) => (
        <TreeNodes
          key={childNode.id}
          node={childNode}
          onNodeClick={onNodeClick}
          selectedNodeId={selectedNodeId}
        />
      ))}
    </TreeNode>
  )
}

export default TreeNodes
