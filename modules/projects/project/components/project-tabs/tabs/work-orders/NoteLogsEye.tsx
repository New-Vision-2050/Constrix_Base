"use client";

import { useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { useNoteLogs } from "@/modules/projects/project/query/useNoteLogs";
import type { NoteLog } from "@/services/api/projects/project-order-permits/types/response";
import type { NoteLogTypeFilter } from "./noteLogTypes";

interface NoteLogsEyeProps {
  projectId: string | undefined;
  orderPermitId: string;
  emptyDash: string;
  noteTypes?: NoteLogTypeFilter;
}

function formatLogDateTime(log: NoteLog): string {
  if (log.created_at) return log.created_at;
  if (!log.created_at_date) return "—";
  const time = log.created_at_time ? ` ${log.created_at_time}` : "";
  return `${log.created_at_date}${time}`;
}

function getLogUserName(log: NoteLog): string {
  return log.user_name?.trim() || log.created_by_name?.trim() || "—";
}

export default function NoteLogsEye({
  projectId,
  orderPermitId,
  emptyDash,
  noteTypes,
}: NoteLogsEyeProps) {
  const t = useTranslations("project.workOrdersTab.noteLogs");
  const [open, setOpen] = useState(false);
  const { data: logs, isLoading } = useNoteLogs(
    open ? projectId : undefined,
    open ? orderPermitId : undefined,
    noteTypes,
  );

  return (
    <>
      <Tooltip title={t("viewTooltip")}>
        <IconButton
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
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle sx={{ pr: 6 }}>
          {t("title")}
          <IconButton
            onClick={() => setOpen(false)}
            aria-label={t("title")}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={28} />
            </Box>
          ) : !logs || logs.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ py: 4, textAlign: "center" }}
            >
              {t("empty")}
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "action.hover" }}>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                      {t("user")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t("note")}</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                      {t("dateTime")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log, idx) => (
                    <TableRow key={log.id ?? idx}>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {getLogUserName(log)}
                      </TableCell>
                      <TableCell>{log.note?.trim() || emptyDash}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {formatLogDateTime(log)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
