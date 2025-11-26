"use client";

import { useState, SyntheticEvent } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useTranslations } from "next-intl";
import ContactDataForm from "./ContactDataForm";
import AddressTable from "./address-table";
import SocialLinksTable from "./social-links-table";
import { ContactInfo } from "../schema/contact-data.schema";

interface CommunicationTabsProps {
  contactInfo?: ContactInfo;
}

/**
 * Communication Settings Tabs Component
 * Organizes contact, address, and social links in separate tabs
 */
export default function CommunicationTabs({ contactInfo }: CommunicationTabsProps) {
  const t = useTranslations("content-management-system.communicationSetting");
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  /**
   * 
   * @returns PERMISSIONS.CMS.communicationSettings.contactData.update
   */

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <ContactDataForm initialValues={contactInfo} />;
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
          <Tab label={t("tabs.contactData")} id="tab-0" aria-controls="tabpanel-0" />
          <Tab label={t("tabs.addresses")} id="tab-1" aria-controls="tabpanel-1" />
          <Tab label={t("tabs.socialLinks")} id="tab-2" aria-controls="tabpanel-2" />
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

