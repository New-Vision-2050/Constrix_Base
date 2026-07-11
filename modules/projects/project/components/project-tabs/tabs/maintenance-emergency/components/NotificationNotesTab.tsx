"use client";

import { useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useProjectNotificationNotes,
  useAddProjectNotificationNoteMutation,
} from "@/modules/projects/project/query/useProjectNotificationMutations";
import type { ProjectNotificationNote } from "@/services/api/projects/notifications/types/response";
import type { NotificationScope } from "@/modules/projects/project/utils/notificationScope";

const MAX_NOTE_LENGTH = 1000;

function getInitials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return `${first}${last}`.toUpperCase() || "?";
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

interface NotificationNotesTabProps {
  notificationId: string;
  scope: NotificationScope;
}

export default function NotificationNotesTab({
  notificationId,
  scope,
}: NotificationNotesTabProps) {
  const t = useTranslations("project.maintenanceEmergency.notifications");
  const [newNote, setNewNote] = useState("");
  const listTopRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isError } = useProjectNotificationNotes(notificationId);
  const addNoteMutation = useAddProjectNotificationNoteMutation(notificationId, scope);

  const items = data?.items ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newNote.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_NOTE_LENGTH) {
      toast.error(t("noteTooLong"));
      return;
    }

    try {
      await addNoteMutation.mutateAsync({ note: trimmed });
      setNewNote("");
      listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? t("addNoteError"));
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{t("notesLoadError")}</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2.5}>
      <div ref={listTopRef} />

      {items.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            {t("noNotes")}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
            },
            gap: 2.5,
          }}
        >
          {items.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </Box>
      )}

      <Divider />

      <Paper
        component="form"
        onSubmit={handleSubmit}
        variant="outlined"
        sx={{ p: 2, borderRadius: 2 }}
      >
        <TextField
          fullWidth
          multiline
          rows={3}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder={t("writeNote")}
          disabled={addNoteMutation.isPending}
          inputProps={{ maxLength: MAX_NOTE_LENGTH }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {newNote.length}/{MAX_NOTE_LENGTH}
          </Typography>
          <Button
            type="submit"
            variant="contained"
            disabled={!newNote.trim() || addNoteMutation.isPending}
          >
            {addNoteMutation.isPending ? t("addingNote") : t("addNote")}
          </Button>
        </Box>
      </Paper>
    </Stack>
  );
}

function NoteCard({ note }: { note: ProjectNotificationNote }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <Typography
        variant="body2"
        sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
      >
        {note.note}
      </Typography>
      <Divider />
      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
        <Avatar
          sx={{
            width: 32,
            height: 32,
            fontSize: 12,
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          {getInitials(note.user?.name)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {note.user?.name ?? "—"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {note.branch?.name ?? "—"} &bull; {formatDateTime(note.created_at)}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
