"use client";

import { useState, useRef } from "react";
import {
  Popover,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Eye } from "lucide-react";
import { useNoteLogs } from "@/modules/projects/project/query/useNoteLogs";

interface NoteLogsEyeProps {
  projectId: string | undefined;
  orderPermitId: string;
  emptyDash: string;
  noteType?: string;
}

function formatLogDate(dateStr: string | null, timeStr: string | null): string {
  if (!dateStr) return "—";
  const time = timeStr ? ` ${timeStr}` : "";
  return `${dateStr}${time}`;
}

export default function NoteLogsEye({
  projectId,
  orderPermitId,
  emptyDash,
  noteType,
}: NoteLogsEyeProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const { data: logs, isLoading } = useNoteLogs(
    open ? projectId : null,
    open ? orderPermitId : null,
    noteType,
  );

  return (
    <>
      <Tooltip title="View note logs">
        <IconButton
          ref={anchorRef}
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          sx={{ padding: "2px" }}
        >
          <Eye className="w-4 h-4" />
        </IconButton>
      </Tooltip>
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              maxWidth: 480,
              width: 480,
              maxHeight: 400,
              overflow: "auto",
              p: 2,
            },
          },
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
          Note Logs
        </Typography>
        <Divider sx={{ mb: 1 }} />
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : !logs || logs.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
            {emptyDash}
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {logs.map((log, idx) => (
              <Box key={log.id ?? idx}>
                <Typography variant="caption" color="text.secondary">
                  {formatLogDate(log.created_at_date, log.created_at_time)}
                  {log.created_by_name ? ` — ${log.created_by_name}` : ""}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.25 }}>
                  {log.note || emptyDash}
                </Typography>
                {idx < logs.length - 1 && <Divider sx={{ mt: 1.5 }} />}
              </Box>
            ))}
          </Box>
        )}
      </Popover>
    </>
  );
}
