import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Manager } from "../types/CustomBranchNode";

type BranchNodeData = NodeProps & {
  name?: string;
  type?: string;
  branch_count?: number;
  department_count?: number;
  management_count?: number;
  manager?: Manager;
  parent_id?: number;
  user_count?: number;
  statistics?: {
    employees?: number;
    branch?: number;
    managements?: number;
  };
};

const BranchCustomNode: React.FC<BranchNodeData> = (props) => {
  const { data } = props;

  return (
    <div
      dir="rtl"
      className="flex items-start justify-center p-6 flex-col rounded-lg bg-sidebar"
    >
      <div className="flex items-center gap-2">
        <Building2 color="pink" />
        <p className="text-lg font-bold text-white">
          {(data?.name as string) ?? "فرع بدون اسم"}
        </p>
      </div>
      <p className="text-sm font-semibold text-slate-500">
        {(data?.type as string) ?? "فرع بدون نوع"}
      </p>
      <div className="flex items-center gap-2">
        <Badge color="primary">
          {`${(data?.user_count as number) ?? 0} موظف`}
        </Badge>
        <Badge className="text-orange-500 bg-orange-200">
          {`${(data?.branch_count as number) ?? 0} فرع`}
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

export default BranchCustomNode;
