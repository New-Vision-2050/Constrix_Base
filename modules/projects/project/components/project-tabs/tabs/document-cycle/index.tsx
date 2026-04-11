"use client";

import { Box } from "@mui/material";
import AttachmentRequestsTable from "./components/AttachmentRequestsTable";

export default function DocumentCycleTab() {
  return (
    <Box sx={{ p: 3 }}>
      <AttachmentRequestsTable />
    </Box>
  );
}
