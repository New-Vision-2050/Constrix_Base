import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Mail, PhoneCall } from "lucide-react";

type UserNodeData = NodeProps & {
  name?: string;
  email?: string;
  phone?: string;
  title?: string;
  branchName?: string;
};

const CustomUserNode: React.FC<UserNodeData> = (props) => {
  const { data } = props;

  return (
    <div
      dir="rtl"
      className="flex items-start justify-between p-6 flex-col rounded-lg bg-sidebar gap-6"
    >
      <div className="flex flex-col gap-1 items-center justify-center">
        <img
          src="https://plus.unsplash.com/premium_photo-1669343628944-d0e2d053a5e8?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          height={40}
          width={42}
          className="rounded-[50%] shadow-md"
        />
        <p className="text-lg font-bold text-white">
          {(data?.name as string) ?? "اسم المستخدم"}
        </p>
        <p className="text-sm font-semibold text-slate-500">
          {(data?.title as string) ?? "الوظيفة"}
        </p>
        <p className="text-sm font-semibold text-slate-500">
          {(data?.branchName as string) ?? "الفرع"}
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <PhoneCall color="pink" />
          <p className="font-semibold text-white">
            {(data?.phone as string) ?? "رقم الجوال"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Mail color="pink" />
          <p className="font-semibold text-white">
            {(data?.email as string) ?? "الأيميل"}
          </p>
        </div>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomUserNode;
