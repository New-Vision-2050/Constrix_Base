import { Row } from "@tanstack/react-table";
import React from "react";
import { ArabicDataItem } from "../data";
import { AvatarGroup } from "@/components/shared/avatar-group";

const Company = ({ row }: { row: Row<ArabicDataItem> }) => {
  const { companyLogo, title, userName } = row.original; 
  return (
    <div className="flex gap-3 border-e-2">
      <AvatarGroup fullName={title} src={companyLogo} alt={title} />
      <div>
        <p className="font-medium">{title}</p>
        <p dir="ltr" className="text-xs">
          @{userName}
        </p>
      </div>
    </div>
  );
};

export default Company;
