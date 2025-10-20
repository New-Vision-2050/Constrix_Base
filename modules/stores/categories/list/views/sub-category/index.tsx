"use client";

import { TableBuilder } from "@/modules/table";
import { DiscountMockTabeConfig } from "../../../_config/mainTableConfig";

function FreeDeliveryView() {
  return <TableBuilder config={DiscountMockTabeConfig()} />;
}

export default FreeDeliveryView;
