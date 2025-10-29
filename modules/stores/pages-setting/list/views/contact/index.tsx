"use client";

import TabsGroup from "@/components/shared/TabsGroup";
import { ContactBannersTable } from "./ContactBannersTable";
import { BranchesTable } from "./BranchesTable";
import { FeaturesTable } from "./FeaturesTable";

function ContactView() {
  return (
    <TabsGroup
      tabs={[
        {
          label: "لافتات التواصل",
          value: "banners",
          component: <ContactBannersTable />,
        },
        {
          label: "الفروع",
          value: "branches",
          component: <BranchesTable />,
        },
        {
          label: "ميزات جديدة",
          value: "features",
          component: <FeaturesTable />,
        },
      ]}
      defaultValue="banners"
      variant="primary"
    />
  );
}

export default ContactView;
