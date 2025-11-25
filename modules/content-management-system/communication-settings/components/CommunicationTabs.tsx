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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

/**
 * Tab Panel Component
 * Renders content for each tab
 */
function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
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

      <TabPanel value={activeTab} index={0}>
        <ContactDataForm initialValues={contactInfo} />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <AddressTable />
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <SocialLinksTable />
      </TabPanel>
    </Box>
  );
}

