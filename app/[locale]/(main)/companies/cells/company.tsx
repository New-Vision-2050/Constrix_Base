import React from "react";
import { AvatarGroup } from "@/components/shared/avatar-group";

// Define a proper type for the company row
interface CompanyRow {
  name: string;
  user_name: string;
  [key: string]: unknown; // Allow for other properties
}

const Company = ({ row }: { row: CompanyRow }) => {
  const { name, user_name } = row;
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
