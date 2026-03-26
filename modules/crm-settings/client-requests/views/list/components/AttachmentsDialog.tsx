"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

const ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

type Row = { id: string; file: File | null };

function rowsFromFiles(files: File[]): Row[] {
  if (files.length === 0) return [];
  return files.map((file) => ({ id: crypto.randomUUID(), file }));
}

function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export interface AttachmentsDialogProps {
  open: boolean;
  onClose: () => void;
  /** Files currently stored on the form (when dialog opens). */
  initialFiles: File[];
  /** Apply files to the form and close (no API call). */
  onDone: (files: File[]) => void;
}

export function AttachmentsDialog({
  open,
  onClose,
  initialFiles,
  onDone,
}: AttachmentsDialogProps) {
  const t = useTranslations("clientRequests.form");

  const [rows, setRows] = useState<Row[]>([]);
  const addRowInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setRows(rowsFromFiles(initialFiles));
    }
  }, [open, initialFiles]);

  const collectedFiles = useMemo(
    () => rows.map((r) => r.file).filter((f): f is File => f !== null),
    [rows],
  );

  const setFileForRow = useCallback((rowId: string, file: File | null) => {
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, file } : r)));
  }, []);

  const addRow = useCallback(() => {
    addRowInputRef.current?.click();
  }, []);

  const removeRow = useCallback((rowId: string) => {
    setRows((prev) => prev.filter((r) => r.id !== rowId));
  }, []);

  const handleAddFile = (file: File | null) => {
    if (!file) return;
    setRows((prev) => [...prev, { id: crypto.randomUUID(), file }]);
  };

  const handleDone = () => {
    onDone(collectedFiles);
  };

  const handleClose = () => onClose();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          color: "#fff",
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.12)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 0.5,
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          pb: 1.5,
        }}
      >
        <Typography component="div" variant="h6" fontWeight={700}>
          {t("attachmentsDialogTitle")}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", my: 3 }}>
          <input
            ref={addRowInputRef}
            type="file"
            hidden
            accept={ACCEPT}
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              handleAddFile(f);
              e.target.value = "";
            }}
          />
          <Button
            variant="contained"
            onClick={addRow}
            startIcon={<Plus size={16} />}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              px: 1.5,
            }}
          >
            {t("addAttachmentRow")}
          </Button>
        </Box>
        <Table
          size="small"
          sx={{
            "& td, & th": { borderColor: "rgba(255,255,255,0.12)" },
            "& .MuiTableHead-root th": {
              color: "rgba(255,255,255,0.85)",
              fontWeight: 700,
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>{t("attachmentsTableFile")}</TableCell>
              <TableCell width={120}>{t("size")}</TableCell>
              <TableCell width={72} align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  sx={{
                    textAlign: "center",
                    py: 3,
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  {t("addAttachmentRow")}
                </TableCell>
              </TableRow>
            )}
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.04)" },
                }}
              >
                <TableCell>
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    sx={{
                      color: "#fff",
                      borderColor: "rgba(255,255,255,0.35)",
                      maxWidth: "100%",
                      textTransform: "none",
                      justifyContent: "flex-start",
                      px: 1.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ maxWidth: 360, display: "block" }}
                    >
                      {row.file ? row.file.name : t("selectFile")}
                    </Typography>
                    <input
                      type="file"
                      hidden
                      accept={ACCEPT}
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        setFileForRow(row.id, f);
                        e.target.value = "";
                      }}
                    />
                  </Button>
                </TableCell>
                <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                  {row.file ? formatFileSize(row.file.size) : "—"}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title={t("removeAttachmentRow")}>
                    <IconButton
                      size="small"
                      onClick={() => removeRow(row.id)}
                      sx={{ color: "rgba(255,255,255,0.7)" }}
                      aria-label={t("removeAttachmentRow")}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          gap: 1,
          flexWrap: "wrap",
          borderTop: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.35)" }}
        >
          {t("attachmentsCancel")}
        </Button>
        <Button
          variant="contained"
          onClick={handleDone}
          sx={{ ml: "auto", textTransform: "none", fontWeight: 700 }}
        >
          {t("attachmentsDone")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
