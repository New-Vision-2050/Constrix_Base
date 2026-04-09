"use client";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import type { InboxTypeKey } from "@/modules/projects/inbox/map-invitation-to-row";
import type { InboxStatusSegment } from "@/modules/projects/inbox/inbox-status-segment";

export type InboxSortPreset = "date_desc" | "date_asc" | "name_asc" | "name_desc";

export type InboxFiltersBarProps = {
  documentType: "all" | InboxTypeKey;
  onDocumentTypeChange: (v: "all" | InboxTypeKey) => void;
  status: "all" | InboxStatusSegment;
  onStatusChange: (v: "all" | InboxStatusSegment) => void;
  sortPreset: InboxSortPreset;
  onSortPresetChange: (v: InboxSortPreset) => void;
  searchComponent: React.ReactNode;
  labels: {
    documentType: string;
    status: string;
    sortBy: string;
    all: string;
    typeProject: string;
    typeAttachment: string;
    typeRequest: string;
    typeQuote: string;
    statusAll: string;
    statusAwaiting: string;
    statusInProgress: string;
    statusAccepted: string;
    statusRejected: string;
    sortDateNewest: string;
    sortDateOldest: string;
    sortNameAsc: string;
    sortNameDesc: string;
  };
};

export default function InboxFiltersBar({
  documentType,
  onDocumentTypeChange,
  status,
  onStatusChange,
  sortPreset,
  onSortPresetChange,
  searchComponent,
  labels,
}: InboxFiltersBarProps) {
  const onDoc = (e: SelectChangeEvent<"all" | InboxTypeKey>) => {
    onDocumentTypeChange(e.target.value as "all" | InboxTypeKey);
  };
  const onSt = (e: SelectChangeEvent<"all" | InboxStatusSegment>) => {
    onStatusChange(e.target.value as "all" | InboxStatusSegment);
  };
  const onSort = (e: SelectChangeEvent<InboxSortPreset>) => {
    onSortPresetChange(e.target.value as InboxSortPreset);
  };

  const selectSx = { minWidth: { xs: "100%", sm: 180 } };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        flexWrap: "wrap",
        alignItems: { xs: "stretch", md: "center" },
        gap: 2,
        mb: 2,
      }}
    >
      <Box sx={{ flex: 1, minWidth: { xs: "100%", md: 220 } }}>
        {searchComponent}
      </Box>

      <FormControl size="small" sx={selectSx}>
        <InputLabel id="inbox-doc-type-label">{labels.documentType}</InputLabel>
        <Select<"all" | InboxTypeKey>
          labelId="inbox-doc-type-label"
          label={labels.documentType}
          value={documentType}
          onChange={onDoc}
        >
          <MenuItem value="all">{labels.all}</MenuItem>
          <MenuItem value="project">{labels.typeProject}</MenuItem>
          <MenuItem value="attachment">{labels.typeAttachment}</MenuItem>
          <MenuItem value="request">{labels.typeRequest}</MenuItem>
          <MenuItem value="quote">{labels.typeQuote}</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={selectSx}>
        <InputLabel id="inbox-status-label">{labels.status}</InputLabel>
        <Select<"all" | InboxStatusSegment>
          labelId="inbox-status-label"
          label={labels.status}
          value={status}
          onChange={onSt}
        >
          <MenuItem value="all">{labels.statusAll}</MenuItem>
          <MenuItem value="awaiting">{labels.statusAwaiting}</MenuItem>
          <MenuItem value="in_progress">{labels.statusInProgress}</MenuItem>
          <MenuItem value="accepted">{labels.statusAccepted}</MenuItem>
          <MenuItem value="rejected">{labels.statusRejected}</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={selectSx}>
        <InputLabel id="inbox-sort-label">{labels.sortBy}</InputLabel>
        <Select<InboxSortPreset>
          labelId="inbox-sort-label"
          label={labels.sortBy}
          value={sortPreset}
          onChange={onSort}
        >
          <MenuItem value="date_desc">{labels.sortDateNewest}</MenuItem>
          <MenuItem value="date_asc">{labels.sortDateOldest}</MenuItem>
          <MenuItem value="name_asc">{labels.sortNameAsc}</MenuItem>
          <MenuItem value="name_desc">{labels.sortNameDesc}</MenuItem>
        </Select>
      </FormControl>

    </Box>
  );
}
