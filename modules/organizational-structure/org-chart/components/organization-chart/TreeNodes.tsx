import { OrgChartNode } from '@/types/organization'
import { TreeNode } from 'react-organizational-chart'
import ChartNode from './ChartNode'
import { useLocale } from 'next-intl'
import OrgChartAddButton from './chart-add-button'
import { DropdownItemT } from '@/components/shared/dropdown-button'

interface TreeNodesProps {
  node: OrgChartNode;
  onNodeClick: (node: OrgChartNode) => void;
  selectedNodeId: string | null;
  onAddBtnClick?: (node: OrgChartNode) => void;
  DropDownMenu?: (node: OrgChartNode) => DropdownItemT[];
  reOrganize?: { concatKey: string, concatValue: string | number | undefined }
}

const TreeNodes = ({
                     node,
                     onNodeClick,
                     selectedNodeId,
                     onAddBtnClick,
                     DropDownMenu,
                     reOrganize
                   }: TreeNodesProps) => {
  const locale = useLocale()
  return (
    <TreeNode
      label={
        <div
          className={`flex flex-col items-center item-${
            node.children?.length === 1 ? node.children[0]?.type : node?.type
          }`}
        >
          {reOrganize?.concatKey && node[reOrganize?.concatKey] === reOrganize?.concatValue && node.list?.length
            ? <ul className={`w-full combined-nodes-wrapper ${node.list?.length > 1 ? `combined-nodes-container list-${reOrganize?.concatValue}` : ''} `}>
              {node.list?.map((childNode) => (
                <TreeNodes
                  key={childNode.id}
                  node={childNode}
                  onNodeClick={onNodeClick}
                  selectedNodeId={selectedNodeId}
                  DropDownMenu={DropDownMenu}
                  onAddBtnClick={onAddBtnClick}
                  reOrganize={reOrganize}
                />
              ))}
            </ul>
            : <>
              <ChartNode
                node={node}
                onNodeClick={onNodeClick}
                isSelected={node.id === selectedNodeId}
                isFirst={!node.children?.length}
                DropDownMenu={DropDownMenu}
              />
              <OrgChartAddButton node={node} onAddBtnClick={onAddBtnClick}/>
            </>
          }
        </div>
      }
      className={`item-${node?.type} ${locale === 'ar' ? 'tree-fix-ar' : ''}`}
    >
      {node.children?.map((childNode) => (
        <TreeNodes
          key={childNode.id}
          node={childNode}
          onNodeClick={onNodeClick}
          selectedNodeId={selectedNodeId}
          DropDownMenu={DropDownMenu}
          onAddBtnClick={onAddBtnClick}
          reOrganize={reOrganize}
        />
      ))}
    </TreeNode>
  )
}

export default TreeNodes
