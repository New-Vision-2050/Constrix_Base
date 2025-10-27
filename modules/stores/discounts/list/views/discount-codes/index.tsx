"use client";

import { TableBuilder } from "@/modules/table";
import { DiscountMockTabeConfig } from "../../../_mock/tableConfig";

function DiscountCodesView() {
  return <TableBuilder config={DiscountMockTabeConfig()} />;
}

export default DiscountCodesView;
