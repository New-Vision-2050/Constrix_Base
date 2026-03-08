"use client";

import TabsGroup from "@/components/shared/TabsGroup";

import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Tab } from "@/types/Tab";
import ContactBannersTable from "./ContactBannersTable";
import BranchesTable from "./BranchesTable";
import FeaturesTable from "./FeaturesTable";

type ShowableTab = Tab & { show: boolean };

function ContactView() {
  const { can } = usePermissions();

  const tabs: ShowableTab[] = [
    {
      label: "لافتات التواصل",
      value: "banners",
      component: <ContactBannersTable />,
      show: can(PERMISSIONS.ecommerce.banner.list),
    },
    {
      label: "الفروع",
      value: "branches",
      component: <BranchesTable />,
      show: can(PERMISSIONS.ecommerce.banner.list),
    },
    {
      label: "ميزات جديدة",
      value: "features",
      component: <FeaturesTable />,
      show: can(PERMISSIONS.ecommerce.banner.list),
    },
  ];

  return (
    <TabsGroup
      tabs={tabs.filter((tab) => tab.show)}
      defaultValue="banners"
      variant="primary"
    />
  );
}

export default ContactView;
