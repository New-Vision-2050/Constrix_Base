"use client";

import TabsGroup from "@/components/shared/TabsGroup";
import MainCategoryView from "./views/main-category";
import SubCategoriesView from "./views/sub-category";
import SubSubCategoriesView from "./views/sub-sub-category";

function CategoriesView() {
  return (
    <div className="space-y-1">
      <TabsGroup
        tabs={[
          {
            label: "القسم الرئيسي",
            value: "main",
            component: <MainCategoryView />,
          },
          {
            label: "القسم الفرعي",
            value: "sub",
            component: <SubCategoriesView />,
          },
          {
            label: "قسم الفرعي الفرعي",
            value: "sub-sub",
            component: <SubSubCategoriesView />,
          },
        ]}
        defaultValue="main"
        variant="primary"
      />
    </div>
  );
}

export default CategoriesView;
