import React from "react";
import TableProvider from "../../../components/shared/table-provider";
import { columns } from "./columns";
import { endPoints } from "@/modules/auth/constant/end-points";

const Page = () => {
  return (
    <TableProvider
      columns={columns}
      endPoint={endPoints.companies.getAll}
      queryKey="companies"
    />
  );
};

export default Page;
