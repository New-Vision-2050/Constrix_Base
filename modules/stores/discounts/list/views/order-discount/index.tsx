"use client";

import { TableBuilder } from "@/modules/table";
import { DiscountMockTabeConfig } from "../../../_mock/tableConfig";

function OrderDiscountView() {
  return <TableBuilder config={DiscountMockTabeConfig()} />;
}

export default OrderDiscountView;
