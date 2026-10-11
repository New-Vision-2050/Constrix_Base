"use client";

import { useState } from "react";
import { Banknote, CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import LeavesTab from "./leaves";
import AdvancesTab from "./advances";

const LEAVES_TAB_ID = "contract-settings-tab-leaves";
const ADVANCES_TAB_ID = "contract-settings-tab-advances";

export default function ContractSettingsTab({ userId }: { userId: string }) {
  const t = useTranslations("UserProfile.tabs.contractTabs.contractSettings");
  const [activeTab, setActiveTab] = useState(LEAVES_TAB_ID);

  return (
    <HorizontalTabs
      value={activeTab}
      defaultValue={LEAVES_TAB_ID}
      onTabClick={(tab) => setActiveTab(tab.id)}
      list={[
        {
          id: LEAVES_TAB_ID,
          title: t("leaves"),
          icon: <CalendarDays />,
          content: <LeavesTab userId={userId} />,
        },
        {
          id: ADVANCES_TAB_ID,
          title: t("advances"),
          icon: <Banknote />,
          content: <AdvancesTab userId={userId} />,
        },
      ]}
    />
  );
}
