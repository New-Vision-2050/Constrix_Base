import { OrgChartNode } from "@/types/organization";
import DepartmentIcon from "@/public/icons/department";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownButton,
  DropdownItemT,
} from "@/components/shared/dropdown-button";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface ChartNodeProps {
  node: OrgChartNode;
  onNodeClick: (node: OrgChartNode) => void;
  isSelected?: boolean;
  isFirst?: boolean;
  DropDownMenu?: (node: OrgChartNode) => DropdownItemT[];
}

const ChartNode: React.FC<ChartNodeProps> = ({
  node,
  onNodeClick,
  isSelected = false,
  isFirst = false,
  DropDownMenu,
}) => {
  const isDeputyManagersExist =
    node?.deputy_managers && node?.deputy_managers?.length > 0;
  const isManagerExist = node?.manager?.name;

  const nodeDescriptionType = useMemo(() => {
    switch (node.type) {
      case "branch":
        return node?.is_main ? "فرع الادارة العامة" : "فرع الادارة الفرعية";
      case "management":
        return node?.is_main ? "الادارة الرئيسية" : "ادارة الفرعية";
      default:
        return "Unknown Type";
    }
  }, [node]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onNodeClick(node);
      }}
      className={`node-content w-full bg-sidebar border-0 ${
        isSelected ? "border-primary ring-2 ring-primary" : ""
      } rounded-lg shadow p-4 py-8 min-w-[200px] min-h-[200px] cursor-pointer hover:ring-1 hover:ring-primary transition-colors flex flex-col items-center ${
        isFirst ? "max-w-[400px] mx-auto" : ""
      } item-${
        node.children?.length === 1 ? node.children[0]?.type : node?.type
      }`}
    >
      <div className="w-full items-start flex flex-col">
        <div className="w-full flex items-center justify-between">
          <h3 className="font-semibold text-lg my-1 flex gap-2 align-middle items-center p-2.5">
            <DepartmentIcon className={"text-primary"} /> {node.name}
          </h3>
          {DropDownMenu && (
            <DropdownButton
              triggerButton={<EllipsisVertical />}
              items={DropDownMenu(node)}
            />
          )}
        </div>
        <p className="text-slate-400 px-2 truncate text-sm">
          {nodeDescriptionType}
        </p>
      </div>

      <div
        className={`w-full flex items-start ${
          !isDeputyManagersExist ? "justify-start" : "justify-center"
        } my-3`}
      >
        {isManagerExist && (
          <ManagerComponent
            name={node?.manager?.name as string}
            label="المدير"
          />
        )}

        {isDeputyManagersExist && (
          <div className="flex flex-col flex-grow items-start">
            <p className="text-slate-400">نائب المدير</p>
            {node?.deputy_managers?.map((deputy_manager, index) => (
              <ManagerComponent
                isDeputy={true}
                key={deputy_manager.id + "." + index}
                name={deputy_manager?.name as string}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 max-w-[300px]">
        {node?.user_count ? (
          <div className="w-1/2 p-1 flex-1 min-w-[82px] bg-[#512B4F] rounded-2xl text-[12px] text-primary flex justify-center items-center">
            {node?.user_count} موظف
          </div>
        ) : (
          ""
        )}
        {node?.branch_count ? (
          <div className="w-1/2 p-1 flex-1 min-w-[82px] bg-[#211732] rounded-2xl text-[12px] text-[#F19B02] flex justify-center items-center">
            {node?.branch_count} فرع
          </div>
        ) : (
          ""
        )}
        {node?.management_count ? (
          <div className="w-1/2 p-1 flex-1 min-w-[82px] bg-[#38484A] rounded-2xl text-[12px] text-[#18CB5F] flex justify-center items-center">
            {node?.management_count} إدارة
          </div>
        ) : (
          ""
        )}
        {node?.department_count ? (
          <div className="w-1/2 p-1 flex-1 min-w-[82px] bg-[#512B4F] rounded-2xl text-[12px] text-primary flex justify-center items-center">
            {node?.department_count} قسم
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const ManagerComponent = ({
  name,
  label,
  isDeputy,
}: {
  label?: string;
  isDeputy?: boolean;
  name: string;
}) => {
  return (
    <div className="flex gap-2 items-center mx-2">
      <div
        className={cn(
          "w-[30px] h-[30px] flex justify-center items-center font-semibold rounded-full",
          !isDeputy
            ? "bg-primary"
            : name === "No Manager Assigned"
            ? "bg-gray-600"
            : "bg-[#F19B02]"
        )}
      >
        {name ? name?.[0]?.toUpperCase() : "N/A"}
      </div>
      <div className="flex flex-col items-start flex-grow">
        {label && <p className="text-slate-400">{label}</p>}
        <p>{name}</p>
      </div>
    </div>
  );
};

export default ChartNode;
