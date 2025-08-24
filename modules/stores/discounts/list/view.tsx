"use client";

import TabsGroup from "@/components/shared/TabsGroup";

function ListDiscountsView() {
  return (
    <div className="space-y-4">
      <TabsGroup
        tabs={[
          {
            label: "تخفيض المنتج",
            value: "item-discount",
            component: "Item Discount",
          },
          {
            label: "تخفيض بالطلب",
            value: "item-discount2",
            component: "Item Discount",
          },
          {
            label: "تخفيض بالوقت",
            value: "item-discount3",
            component: "Item Discount",
          },
          {
            label: "اكواد التخفيض",
            value: "item-discount4",
            component: "Item Discount",
          },
          {
            label: "تخفيض بالباقة",
            value: "item-discount5",
            component: "Item Discount",
          },
          {
            label: "توصيل مجاني",
            value: "item-discount6",
            component: "Item Discount",
          },
        ]}
        defaultValue="item-discount"
        variant="primary"
      />
    </div>
  );
}

export default ListDiscountsView;
