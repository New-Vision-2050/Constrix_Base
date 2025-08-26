"use client";

import { TableBuilder } from "@/modules/table";
import { DiscountMockTabeConfig } from "../../../_mock/tableConfig";

function PackageDiscountView() {
  return <TableBuilder config={DiscountMockTabeConfig()} />;
}

export default PackageDiscountView;
