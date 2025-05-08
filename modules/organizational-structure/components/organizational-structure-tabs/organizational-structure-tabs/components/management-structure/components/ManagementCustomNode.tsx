import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Building2, EllipsisVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Manager } from "../../company-structure/types/CustomBranchNode";

type ManagementNodeData = NodeProps & {
  name?: string;
  type?: string;
  branch_count?: number;
  department_count?: number;
  management_count?: number;
  manager?: Manager;
  deputy_manager?: Manager;
  parent_id?: number;
  user_count?: number;
  statistics?: {
    employees?: number;
    branch?: number;
    managements?: number;
  };
};

const ManagementCustomNode: React.FC<ManagementNodeData> = (props) => {
  const { data } = props;

  return (
    <div
      dir="rtl"
      className="flex items-start gap-4 justify-center p-6 flex-col rounded-lg bg-sidebar"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Building2 color="pink" />
          <p className="text-lg font-bold text-white">
            {(data?.name as string) ?? "فرع بدون اسم"}
          </p>
        </div>
        <EllipsisVertical />
      </div>

      <div className="flex w-full items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 text-sm">المدير</p>
          <p className="text-white text-md">
            {(data?.manager?.name as string) ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-slate-500 text-sm">المدير النائب</p>
          <p className="text-white text-md">
            {(data?.deputy_manager?.name as string) ?? "-"}
          </p>
        </div>
      </div>

      <div className="flex w-full justify-around items-center gap-2">
        <Badge color="primary">
          {`${(data?.user_count as number) ?? 0} موظف`}
        </Badge>

        <Badge className="text-green-500 bg-green-200">
          {`${(data?.management_count as number) ?? 0} ادارة`}
        </Badge>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default ManagementCustomNode;
