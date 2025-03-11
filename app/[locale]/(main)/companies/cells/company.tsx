import React from "react";
import { AvatarGroup } from "@/components/shared/avatar-group";

const Company = ({ row }: { row: any }) => {
  const { name, user_name } = row;
  console.log({ row });
  return (
    <div className="flex gap-3 border-e-2">
      <AvatarGroup
        fullName={name}
        src={"/images/el-anwar-company.png"}
        alt={name}
      />

      <div>
        <p className="font-medium">{name}</p>
        <p dir="ltr" className="text-xs">
          @{user_name}
        </p>
      </div>
    </div>
  );
};

export default Company;
