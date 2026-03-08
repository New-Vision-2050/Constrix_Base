"use client";

import { Box } from "@mui/material";
import WorkOrdersTable from "./work-orders-table";
import TasksTable from "./tasks-table";

export default function WorkspaceTab() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
        gap: 3,
        p: 2,
      }}
    >
      {/* Right side - Work Orders Table */}
      <WorkOrdersTable />

      {/* Left side - Tasks Table */}
      <TasksTable />
    </Box>
  );
}
