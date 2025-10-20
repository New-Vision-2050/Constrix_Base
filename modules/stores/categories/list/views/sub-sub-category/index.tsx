"use client";

import { TableBuilder } from "@/modules/table";
import { DiscountMockTabeConfig } from "../../../_config/mainTableConfig";

function OrderDiscountView() {
  return <TableBuilder config={DiscountMockTabeConfig()} />;
}

export default OrderDiscountView;
