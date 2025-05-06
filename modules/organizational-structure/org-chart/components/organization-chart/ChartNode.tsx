
import { OrgChartNode } from "@/types/organization";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import DepartmentIcon from '@/public/icons/department'

interface ChartNodeProps {
  node: OrgChartNode;
  onNodeClick: (node: OrgChartNode) => void;
  isSelected?: boolean;
  isFirst?: boolean;
}

const ChartNode: React.FC<ChartNodeProps> = ({ node, onNodeClick, isSelected = false, isFirst=false }) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onNodeClick(node);
      }}
      className={`bg-sidebar border-0 ${isSelected ? 'border-primary ring-2 ring-primary' : ''} rounded-lg shadow p-4 py-8 min-w-[200px] min-h-[200px] cursor-pointer hover:ring-1 hover:ring-primary transition-colors flex flex-col items-center ${isFirst? 'max-w-[400px] mx-auto':''} item-${node.children?.length === 1 ? node.children[0]?.type:node?.type}`}
    >
      {/*<Avatar className="h-16 w-16 mb-2">*/}
      {/*  {node.person.avatar ? (*/}
      {/*    <AvatarImage src={node.person.avatar} alt={node.person.name} className="object-cover" />*/}
      {/*  ) : (*/}
      {/*    <AvatarFallback className="bg-blue-100 text-blue-500 text-lg">*/}
      {/*      {node.person.name.charAt(0)}*/}
      {/*    </AvatarFallback>*/}
      {/*  )}*/}
      {/*</Avatar>*/}
      <h3 className="font-semibold text-lg my-1 flex gap-2 align-middle items-center p-2.5"><DepartmentIcon className={'text-primary'}/> {node.name}</h3>
      <p className="text-white/50 mb-6">{node?.manager?.name? `المسؤول: ${node?.manager?.name}`: 'فرع الادارة العامة'}</p>
      <div className="flex flex-wrap gap-2 max-w-[300px]">
        {node?.user_count ? <div className="w-1/2 p-1 flex-1 min-w-[82px] bg-[#512B4F] rounded-2xl text-[12px] text-primary flex justify-center items-center">{node?.user_count} موظف</div>:'' }
        {node?.branch_count ? <div className="w-1/2 p-1 flex-1 min-w-[82px] bg-[#211732] rounded-2xl text-[12px] text-[#F19B02] flex justify-center items-center">{node?.branch_count} فرع</div>:'' }
        {node?.management_count ? <div className="w-1/2 p-1 flex-1 min-w-[82px] bg-[#38484A] rounded-2xl text-[12px] text-[#18CB5F] flex justify-center items-center">{node?.management_count} إدارة</div>:'' }
        {node?.department_count ? <div className="w-1/2 p-1 flex-1 min-w-[82px] bg-[#512B4F] rounded-2xl text-[12px] text-primary flex justify-center items-center">{node?.department_count} قسم</div>:'' }
      </div>
    </div>
  );
};

export default ChartNode;
