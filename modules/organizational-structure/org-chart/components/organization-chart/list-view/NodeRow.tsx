import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, Eye, Table as TableIcon, EyeOff } from 'lucide-react'
import { OrgChartNode } from '@/types/organization'

interface NodeRowProps {
  node: OrgChartNode;
  parentName: string;
  depth: number;
  path: string;
  selectedNodeId: string | null;
  isExpanded: boolean;
  isDetailsExpanded: boolean;
  onToggleExpansion: (nodeId: string) => void;
  onToggleDetails: (node: OrgChartNode) => void;
}

const NodeRow: React.FC<NodeRowProps> = ({
                                           node,
                                           parentName,
                                           depth,
                                           path,
                                           selectedNodeId,
                                           isExpanded,
                                           isDetailsExpanded,
                                           onToggleExpansion,
                                           onToggleDetails
                                         }) => {
  return (
    <div className="flex items-center">
      <div style={{ width: `${depth * 24}px` }} className="flex-shrink-0"/>
      <div
        className={`${depth === 0 ? 'bg-[var(--list-node-background)] mb-[12px]' : 'bg-[var(--list-sub-node-background)] mb-[18px]'} rounded-xl flex-1 flex items-center p-4 gap-2 shadow-sm shadow-[#1415212E]`}>
        {node.children.length > 0 ? (
          <Button
            variant="ghost"
            size="lg"
            className="p-4 h-10 w-10 mr-1 bg-secondary/20 rounded-full [&_svg]:size-6 hover:bg-secondary/80"
            onClick={() => onToggleExpansion(node.id?.toString())}
          >
            {isExpanded ?
              <ChevronDown size={16} className="text-primary"/> :
              <ChevronRight size={16} className="text-primary rtl:scale-[-1]"/>
            }
          </Button>
        ) : (
          <div className="w-10 mr-1"/>
        )}
        <div className="flex flex-1 gap-5 items-center">
          <h3 className="font-bold text-lg">{node.name}</h3>
          <div className="flex flex-1 gap-3">
            {node?.user_count ? <div
              className="w-1/2 p-1 flex-1 min-w-[82px] max-w-[130px] bg-[#512B4F] rounded-2xl text-[12px] text-primary flex justify-center items-center">{node?.user_count} موظف</div> : ''}
            {node?.branch_count ? <div
              className="w-1/2 p-1 flex-1 min-w-[82px] max-w-[130px] bg-[#211732] rounded-2xl text-[12px] text-[#F19B02] flex justify-center items-center">{node?.branch_count} فرع</div> : ''}
            {node?.management_count ? <div
              className="w-1/2 p-1 flex-1 min-w-[82px] max-w-[130px] bg-[#38484A] rounded-2xl text-[12px] text-[#18CB5F] flex justify-center items-center">{node?.management_count} إدارة</div> : ''}
            {node?.department_count ? <div
              className="w-1/2 p-1 flex-1 min-w-[82px] max-w-[130px] bg-[#512B4F] rounded-2xl text-[12px] text-primary flex justify-center items-center">{node?.department_count} قسم</div> : ''}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="lg"
            className="p-4 h-10 w-10 mr-1 rounded-full [&_svg]:size-7 hover:bg-secondary/20"
            onClick={() => onToggleDetails(node)}
          >
            {isDetailsExpanded
              ? <EyeOff className="text-primary"/>
              : <Eye className="text-primary"/>}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NodeRow
