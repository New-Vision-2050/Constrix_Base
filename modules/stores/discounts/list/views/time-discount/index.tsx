"use client";

import { TableBuilder } from "@/modules/table";
import { DiscountMockTabeConfig } from "../../../_mock/tableConfig";

function TimeDiscountView() {
  return <TableBuilder config={DiscountMockTabeConfig()} />;
}

export default TimeDiscountView;
