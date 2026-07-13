"use client";

import { Box } from "@mui/material";
import DocumentRequirementsTable from "./components/DocumentRequirementsTable";

export default function DocumentRequirementsTab() {
  return (
    <Box sx={{ p: 3 }}>
      <DocumentRequirementsTable />
    </Box>
  );
}
