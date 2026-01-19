"use client";

import { Box } from "@mui/material";
import ContactDataForm from "./ContactDataForm";
import AddressTable from "./address-table";
import SocialLinksTable from "./social-links-table";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function CommunicationTabs() {
  const { can } = usePermissions();

  return (
    <Box sx={{ width: "100%" }}>
      {can(PERMISSIONS.CMS.communicationSettings.contactData.update) && (
        <ContactDataForm />
      )}
      {can(PERMISSIONS.CMS.communicationSettings.addresses.list) && (
        <AddressTable />
      )}
      {can(PERMISSIONS.CMS.communicationSettings.socialLinks.list) && (
        <SocialLinksTable />
      )}
    </Box>
  );
}
