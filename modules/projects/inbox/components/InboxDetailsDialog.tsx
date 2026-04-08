"use client";

import { useMemo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import type { PendingShareInvitation } from "@/services/api/projects/project-sharing/types/response";
import type { ProjectInboxRow } from "@/modules/projects/inbox/map-invitation-to-row";
import { formatInboxSentDate } from "@/modules/projects/inbox/inbox-columns";
import { useProjectSettingsTabs } from "@/modules/projects/settings/constants/current-tabs";

export type InboxDetailsDialogProps = {
  open: boolean;
  onClose: () => void;
  row: ProjectInboxRow | null;
  invitation: PendingShareInvitation | null;
  onApprove: () => void;
  onReject: () => void;
  actionPending: boolean;
  canRespond: boolean;
};

function shareStatusLabelForDialog(status: string): string {
  const key = status.trim().toLowerCase();
  switch (key) {
    case "pending":
      return "بانتظار الرد";
    case "sent":
      return "تم الإرسال";
    case "draft":
    case "under_construction":
      return "تحت الإنشاء";
    case "accepted":
    case "approved":
      return "مقبول";
    case "rejected":
      return "مرفوض";
    default:
      return status || "—";
  }
}

const cardSx = {
  p: 1.5,
  borderRadius: 2,
  bgcolor: "action.hover",
  border: 1,
  borderColor: "divider",
} as const;

function InboxDetailsDialogMain({
  row,
  sentLabel,
  typeLabel,
  statusLabel,
  descriptionBody,
  schemaLabels,
  onApprove,
  onReject,
  actionPending,
  canRespond,
}: {
  row: ProjectInboxRow;
  sentLabel: string;
  typeLabel: string;
  statusLabel: string;
  descriptionBody: string;
  schemaLabels: string[];
  onApprove: () => void;
  onReject: () => void;
  actionPending: boolean;
  canRespond: boolean;
}) {
  return (
    <Stack spacing={2.5} sx={{ minWidth: 0 }}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper variant="outlined" sx={cardSx}>
            <Typography variant="caption" color="text.primary" display="block">
              النوع
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {typeLabel}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper variant="outlined" sx={cardSx}>
            <Typography variant="caption" color="text.primary" display="block">
              حالة الاعتماد الحالية
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {statusLabel}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper variant="outlined" sx={cardSx}>
            <Typography variant="caption" color="text.primary" display="block">
              تاريخ التقديم
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {sentLabel}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box>
        <Paper variant="outlined" sx={{ ...cardSx, p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            الوصف
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {descriptionBody}
          </Typography>
        </Paper>
      </Box>

      <Box>
        <Paper variant="outlined" sx={{ ...cardSx, p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            الصلاحيات المختارة
          </Typography>
          {schemaLabels.length > 0 ? (
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {schemaLabels.map((label, index) => {
                const icons = [
                  <GroupsOutlinedIcon key="icon" />,
                  <SearchOutlinedIcon key="icon" />,
                  <FolderOutlinedIcon key="icon" />,
                  <AssignmentOutlinedIcon key="icon" />,
                ];
                return (
                  <Button
                    key={label}
                    variant="outlined"
                    startIcon={icons[index % icons.length]}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      px: 2,
                      py: 1,
                    }}
                  >
                    {label}
                  </Button>
                );
              })}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              لا توجد أقسام محددة
            </Typography>
          )}
        </Paper>
      </Box>

      <Box>
        <Grid container spacing={1.5}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            المرفقات
          </Typography>
        </Grid>
      </Box>

      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        justifyContent="flex-start"
        sx={{ pt: 1, gap: 1 }}
      >
        <Button variant="contained" color="secondary" onClick={onApprove}>
          قبول
        </Button>
        <Button variant="outlined" color="error" onClick={onReject}>
          رفض
        </Button>
        <Button variant="outlined" color="secondary" disabled>
          طلب تعديل
        </Button>
      </Stack>
    </Stack>
  );
}

function InboxDetailsDialogSidebar({
  commentsText,
  noCommentsLabel,
  sharedByName,
  ownerCompanyName,
  sharedWithCompanyName,
  createdAt,
}: {
  commentsText: string | null;
  noCommentsLabel: string;
  sharedByName: string | null;
  ownerCompanyName: string | null;
  sharedWithCompanyName: string | null;
  createdAt: string | null;
}) {
  return (
    <Stack spacing={3} sx={{ height: "100%" }}>
      <Box>
        <Paper variant="outlined" sx={{ ...cardSx, p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
            مسار الاعتماد
          </Typography>
          <Stepper activeStep={1} orientation="vertical">
            <Step completed>
              <StepLabel
                optional={
                  <Typography variant="caption" color="text.secondary">
                    {sharedByName || "—"}
                  </Typography>
                }
              >
                التقديم
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>المراجعة الأولية</StepLabel>
            </Step>
            <Step>
              <StepLabel>المراجعة الفنية</StepLabel>
            </Step>
            <Step>
              <StepLabel>المراجعة التجارية</StepLabel>
            </Step>
          </Stepper>
        </Paper>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
          التعليقات
        </Typography>
        <Paper variant="outlined" sx={{ ...cardSx, p: 2 }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: "primary.dark",
                flexShrink: 0,
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                {sharedByName || "—"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {commentsText || noCommentsLabel}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}

export default function InboxDetailsDialog({
  open,
  onClose,
  row,
  invitation,
  onApprove,
  onReject,
  actionPending,
  canRespond,
}: InboxDetailsDialogProps) {
  const settingsTabs = useProjectSettingsTabs();

  const schemaIds = invitation?.schema_ids ?? [];
  const schemaLabelById = useMemo(() => {
    const m = new Map<number, string>();
    for (const tab of settingsTabs) {
      if (tab.schema_id != null) m.set(tab.schema_id, tab.name);
    }
    return m;
  }, [settingsTabs]);

  const schemaLabels = schemaIds
    .map((id) => schemaLabelById.get(id) ?? `#${id}`)
    .filter(Boolean);

  const descriptionBody = useMemo(() => {
    if (!row) return "";
    const parts = [row.name?.trim(), invitation?.notes?.trim()].filter(
      (x): x is string => Boolean(x && x.length > 0),
    );
    return parts.join("\n\n") || "—";
  }, [row, invitation]);

  const commentsText = invitation?.notes?.trim() ? invitation.notes : null;

  const sentFormatted = row?.sent_at_raw
    ? formatInboxSentDate(row.sent_at_raw).trim()
    : "";
  const sentLabel = sentFormatted || "—";

  const typeLabel = row?.inbox_type_label || "—";
  const statusLabel = row
    ? shareStatusLabelForDialog(row.invitation_status)
    : "—";

  return (
    <Dialog
      open={open && !!row}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
      slotProps={{
        paper: {
          sx: {
            bgcolor: "background.paper",
            backgroundImage: "none",
          },
        },
      }}
    >
      {row ? (
        <>
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 2,
              pr: 1,
            }}
          >
            <Box>
              <Typography variant="h6" component="span" fontWeight={700}>
                تفاصيل الطلب
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                مراجعة وإدارة طلبات المشاركة
              </Typography>
            </Box>
            <IconButton aria-label="close" onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8.5 }}>
                <InboxDetailsDialogMain
                  row={row}
                  sentLabel={sentLabel}
                  typeLabel={typeLabel}
                  statusLabel={statusLabel}
                  descriptionBody={descriptionBody}
                  schemaLabels={schemaLabels}
                  onApprove={onApprove}
                  onReject={onReject}
                  actionPending={actionPending}
                  canRespond={canRespond}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3.5 }}>
                <InboxDetailsDialogSidebar
                  commentsText={commentsText}
                  noCommentsLabel="لا توجد تعليقات"
                  sharedByName={invitation?.shared_by?.name ?? null}
                  ownerCompanyName={invitation?.owner_company?.name ?? null}
                  sharedWithCompanyName={
                    invitation?.shared_with_company?.name ?? null
                  }
                  createdAt={invitation?.created_at ?? null}
                />
              </Grid>
            </Grid>
          </DialogContent>
        </>
      ) : null}
    </Dialog>
  );
}
