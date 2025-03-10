import TableBuilder from "@/modules/table/components/TableBuilder";
import { usersConfig } from "@/modules/table/utils/configs/usersConfig";
import React from "react";

const page = () => {
  return (
    <div className="px-8">
      <TableBuilder config={usersConfig} />
    </div>
  );
};

export default page;
