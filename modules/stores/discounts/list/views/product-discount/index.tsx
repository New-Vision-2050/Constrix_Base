"use client";

import { TableBuilder } from "@/modules/table";
import { DiscountMockTabeConfig } from "../../../_mock/tableConfig";

function ProductDiscountView() {
  return <TableBuilder config={DiscountMockTabeConfig()} />;
}

export default ProductDiscountView;
