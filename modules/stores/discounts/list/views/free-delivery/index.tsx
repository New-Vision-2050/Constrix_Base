"use client";

import { TableBuilder } from "@/modules/table";
import { DiscountMockTabeConfig } from "../../../_mock/tableConfig";

function FreeDeliveryView() {
  return <TableBuilder config={DiscountMockTabeConfig()} />;
}

export default FreeDeliveryView;
