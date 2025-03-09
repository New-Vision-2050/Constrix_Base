import { Row } from "@tanstack/react-table";
import React from "react";
import type { Company } from "../data";
import { AvatarGroup } from "@/components/shared/avatar-group";

const Company = ({ row }: { row: Row<Company> }) => {
  const { name, user_name } = row.original;
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
