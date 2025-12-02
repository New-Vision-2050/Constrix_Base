"use client";

import { useState, SyntheticEvent } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useTranslations } from "next-intl";
import ContactDataForm from "./ContactDataForm";
import AddressTable from "./address-table";
import SocialLinksTable from "./social-links-table";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

/**
 * Communication Settings Tabs Component
 * Organizes contact, address, and social links in separate tabs
 */
export default function CommunicationTabs() {
  const { can } = usePermissions();
  const t = useTranslations("content-management-system.communicationSetting");
  const [activeTab, setActiveTab] = useState(0);

  // tabs list
  const tabs = [
    {
      id: "contactData",
      label: t("tabs.contactData"),
      content: <ContactDataForm />,
      show: can(PERMISSIONS.CMS.communicationSettings.contactData.update),
    },
    {
      id: "addresses",
      label: t("tabs.addresses"),
      content: <AddressTable />,
      show: can(PERMISSIONS.CMS.communicationSettings.addresses.list),
    },
    {
      id: "socialLinks",
      label: t("tabs.socialLinks"),
      content: <SocialLinksTable />,
      show: can(PERMISSIONS.CMS.communicationSettings.socialLinks.list),
    },
  ];

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <ContactDataForm />;
      case 1:
        return <AddressTable />;
      case 2:
        return <SocialLinksTable />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="communication settings tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs?.filter((tab) => tab.show).map((tab) => (
            <Tab key={tab.id} label={tab.label} id={`tab-${tab.id}`} aria-controls={`tabpanel-${tab.id}`} />
          ))}
        </Tabs>
      </Box>

      {/* Single Tab Panel */}
      <Box
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        sx={{ py: 3 }}
      >
        {renderTabContent()}
      </Box>
    </Box>
  );
}

