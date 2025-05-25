import { OrgChartNode } from "@/types/organization";
import { Phone } from 'lucide-react';
import { EllipsisVertical } from "lucide-react";
import {
  DropdownButton,
  DropdownItemT,
} from "@/components/shared/dropdown-button";
import EnvelopIcon from '@/public/icons/envelop'
import { cn } from '@/lib/utils'

interface EmployeeNodeProps {
  node: OrgChartNode;
  onNodeClick: (node: OrgChartNode) => void;
  isSelected?: boolean;
  isFirst?: boolean;
  isDeputy?: boolean;
  DropDownMenu?: (node: OrgChartNode) => DropdownItemT[];
}

const EmployeeNode: React.FC<EmployeeNodeProps> = ({
  node,
  onNodeClick,
  isSelected = false,
  isFirst = false,
  isDeputy = false,
  DropDownMenu,
}) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onNodeClick(node);
      }}
      className={`node-content w-full bg-sidebar border-0 ${
        isSelected ? "border-primary ring-2 ring-primary" : ""
      } rounded-lg shadow p-4 py-8 min-w-[360px] flex-shrink-0 min-h-[250px] cursor-pointer hover:ring-1 hover:ring-primary transition-colors flex flex-col items-center ${
        isFirst ? "max-w-[400px] mx-auto" : ""
      } item-${
        node.children?.length === 1 ? node.children[0]?.type : node?.type
      }`}
    >
      <div className={cn('w-[42] h-[42] flex justify-center items-center font-semibold rounded-full',
        isDeputy
          ? 'bg-[#18CB5F]'
          : (node.name === 'No Manager Assigned'
          ? 'bg-gray-600'
          : (node.type === 'manager' ? 'bg-primary' : 'bg-[#F19B02]'))
      )}>
        {node.name? node.name?.[0]?.toUpperCase(): 'N/A'}
      </div>
      <h3 className="font-semibold text-lg my-1 flex gap-2 align-middle items-center pt-2">
        {node.name}
      </h3>
      {(node.type || isDeputy) && <h4 className="font-normal mt--1 mb-2 flex gap-2 align-middle items-center capitalize text-white/50">
        {node.type ?? "Deputy Manager"}
      </h4>}
      <div className="flex flex-col mt-3 gap-2">
        {node?.phone && <div className="flex items-center gap-2"><Phone className="fill-primary text-primary" strokeWidth={0} /> <span dir={'ltr'}>{node.phone}</span></div>}
        {node?.email && <div className="flex items-center gap-2"><EnvelopIcon className="fill-primary text-primary"/> <span dir={'ltr'}>{node.email}</span></div>}
      </div>
      {DropDownMenu && (
        <DropdownButton
          triggerButton={<EllipsisVertical />}
          items={DropDownMenu(node)}
        />
      )}
    </div>
  );
};

export default EmployeeNode;
