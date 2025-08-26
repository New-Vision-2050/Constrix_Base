"use client";

import TabsGroup from "@/components/shared/TabsGroup";
import ProductDiscountView from "./views/product-discount";
import OrderDiscountView from "./views/order-discount";
import TimeDiscountView from "./views/time-discount";
import DiscountCodesView from "./views/discount-codes";
import PackageDiscountView from "./views/package-discount";
import FreeDeliveryView from "./views/free-delivery";

function ListDiscountsView() {
  return (
    <div className="space-y-4">
      <TabsGroup
        tabs={[
          {
            label: "تخفيض المنتج",
            value: "item-discount",
            component: <ProductDiscountView />,
          },
          {
            label: "تخفيض بالطلب",
            value: "item-discount2",
            component: <OrderDiscountView />,
          },
          {
            label: "تخفيض بالوقت",
            value: "item-discount3",
            component: <TimeDiscountView />,
          },
          {
            label: "اكواد التخفيض",
            value: "item-discount4",
            component: <DiscountCodesView />,
          },
          {
            label: "تخفيض بالباقة",
            value: "item-discount5",
            component: <PackageDiscountView />,
          },
          {
            label: "توصيل مجاني",
            value: "item-discount6",
            component: <FreeDeliveryView />,
          },
        ]}
        defaultValue="item-discount"
        variant="primary"
      />
    </div>
  );
}

export default ListDiscountsView;
