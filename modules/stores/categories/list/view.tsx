"use client";

import TabsGroup from "@/components/shared/TabsGroup";
import MainCategoryView from "./views/main-category";

function CategoriesView() {
  return (
    <div className="space-y-4">
      <TabsGroup
        tabs={[
          {
            label: "القسم الرئيسي",
            value: "item-discount",
            component: <MainCategoryView />,
          },
          {
            label: "القسم الفرعي",
            value: "item-discount2",
            component: <></>,
          },
          {
            label: "قسم الفرعي الفرعي",
            value: "item-discount3",
            component: <></>,
          },
        ]}
        defaultValue="item-discount"
        variant="primary"
      />
    </div>
  );
}

export default CategoriesView;
