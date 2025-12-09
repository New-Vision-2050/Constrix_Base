"use client";

import TabsGroup from "@/components/shared/TabsGroup";
import MainCategoryView from "./views/main-category";
import SubCategoriesView from "./views/sub-category";
import SubSubCategoriesView from "./views/sub-sub-category";
import StatisticsStoreRow from "@/components/shared/layout/statistics-store";
import { statisticsConfig } from "../component/statistics-config";
import { Tab } from "@/types/Tab";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

type ShowableTab = Tab & { show: boolean };

function CategoriesView() {
  // get tabs from permissions
  const { can } = usePermissions();
  const tabs: ShowableTab[] = [
    {
      label: "القسم الرئيسي",
      value: "main",
      component: <MainCategoryView />,
      show: can(PERMISSIONS.ecommerce.category.view),
    },
    {
      label: "القسم الفرعي",
      value: "sub",
      component: <SubCategoriesView />,
      show: can(PERMISSIONS.ecommerce.category.view),
    },
    {
      label: "قسم الفرعي الفرعي",
      value: "sub-sub",
      component: <SubSubCategoriesView />,
      show: can(PERMISSIONS.ecommerce.category.view),
    },
  ];
  return (
    <div className="space-y-1">
      <StatisticsStoreRow config={statisticsConfig} />
      <TabsGroup
        tabs={tabs.filter((tab) => tab.show)}
        defaultValue="main"
        variant="primary"
      />
    </div>
  );
}

export default CategoriesView;
