"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Checkbox, IconButton, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import { Check, X } from "lucide-react";
import type { WorkOrderRow } from "./types";
import type { CompletionPhase, CompletionPhaseStatus } from "@/services/api/projects/project-order-permits/types/response";
import {
  useCompletionData,
  flattenCompletionStatuses,
  getCompletionPhases,
  getAllCompletionStatuses,
} from "@/modules/projects/project/query/useCompletionData";

export type EditablePermitField =
  | "permitStatus"
  | "startPermitDate"
  | "endPermitDate"
  | "noteFromPermitToDepartments"
  | "isTakedAction"
  | "countOfDaysFromAssignedDate"
  | "evaluationPermitStatus"
  | "employeeName"
  | "completionPhase"
  | "phaseStatus"
  | "targetDrilling"
  | "achievedDrilling"
  | "targetExtention"
  | "achievedExtention"
  | "descriptionDetails"
  | "consultantStatement"
  | "lastDateConsultantStatement";

interface EditablePermitCellProps {
  row: WorkOrderRow;
  field: EditablePermitField;
  emptyDash: string;
  yesLabel: string;
  noLabel: string;
  permitStatusOptions: CompletionPhaseStatus[];
  completionPhases: CompletionPhase[];
  completionStatuses: CompletionPhaseStatus[];
  onSave: (id: string, body: Record<string, unknown>) => void;
}

function getRowValue(row: WorkOrderRow, field: EditablePermitField): string {
  switch (field) {
    case "permitStatus":
      return row.permitStatusId != null ? String(row.permitStatusId) : "";
    case "startPermitDate":
      return row.startPermitDate;
    case "endPermitDate":
      return row.endPermitDate;
    case "noteFromPermitToDepartments":
      return row.noteFromPermitToDepartments;
    case "isTakedAction":
      return row.isTakedAction;
    case "countOfDaysFromAssignedDate":
      return row.countOfDaysFromAssignedDate;
    case "evaluationPermitStatus":
      return row.evaluationPermitStatus;
    case "employeeName":
      return row.employeeName;
    case "completionPhase":
      return row.completionPhaseId != null ? String(row.completionPhaseId) : "";
    case "phaseStatus":
      return row.phaseStatusId != null ? String(row.phaseStatusId) : "";
    case "targetDrilling":
      return row.targetDrilling;
    case "achievedDrilling":
      return row.achievedDrilling;
    case "targetExtention":
      return row.targetExtention;
    case "achievedExtention":
      return row.achievedExtention;
    case "descriptionDetails":
      return row.descriptionDetails;
    case "consultantStatement":
      return row.consultantStatement;
    case "lastDateConsultantStatement":
      return row.lastDateConsultantStatement;
  }
}

function buildBody(
  field: EditablePermitField,
  value: string,
): Record<string, unknown> {
  switch (field) {
    case "permitStatus":
      return { phase_status_id: value ? Number(value) : null };
    case "startPermitDate":
      return { start_permit_date: value || null };
    case "endPermitDate":
      return { end_permit_date: value || null };
    case "noteFromPermitToDepartments":
      return { note_from_permit_to_departments: value || null };
    case "isTakedAction":
      return {
        is_taked_action:
          value === "yes" ? 1 : value === "no" ? 0 : null,
      };
    case "countOfDaysFromAssignedDate":
      return {
        count_of_days_from_assigned_date: value ? Number(value) : null,
      };
    case "evaluationPermitStatus":
      return { evaluation_permit_status: value || null };
    case "employeeName":
      return { employee_name: value || null };
    case "completionPhase":
      return { completion_phase_id: value ? Number(value) : null };
    case "phaseStatus":
      return { phase_status_id: value ? Number(value) : null };
    case "targetDrilling":
      return { target_drilling: value ? Number(value) : null };
    case "achievedDrilling":
      return { achieved_drilling: value ? Number(value) : null };
    case "targetExtention":
      return { target_extention: value ? Number(value) : null };
    case "achievedExtention":
      return { achieved_extention: value ? Number(value) : null };
    case "descriptionDetails":
      return { description_details: value || null };
    case "consultantStatement":
      return { consultant_statement: value || null };
    case "lastDateConsultantStatement":
      return { last_date_consultant_statement: value || null };
  }
}

export function PerRowEditablePermitCell({
  row,
  field,
  emptyDash,
  yesLabel,
  noLabel,
  onSave,
}: Omit<EditablePermitCellProps, "permitStatusOptions" | "completionPhases" | "completionStatuses">) {
  const completionDataQuery = useCompletionData(Number(row.id));
  const permitStatusOptions = useMemo(
    () => flattenCompletionStatuses(completionDataQuery.data),
    [completionDataQuery.data],
  );
  const completionPhases = useMemo(
    () => getCompletionPhases(completionDataQuery.data),
    [completionDataQuery.data],
  );
  const completionStatuses = useMemo(
    () => getAllCompletionStatuses(completionDataQuery.data),
    [completionDataQuery.data],
  );
  return (
    <EditablePermitCell
      row={row}
      field={field}
      emptyDash={emptyDash}
      yesLabel={yesLabel}
      noLabel={noLabel}
      permitStatusOptions={permitStatusOptions}
      completionPhases={completionPhases}
      completionStatuses={completionStatuses}
      onSave={onSave}
    />
  );
}

export default function EditablePermitCell({
  row,
  field,
  emptyDash,
  yesLabel,
  noLabel,
  permitStatusOptions,
  completionPhases,
  completionStatuses,
  onSave,
}: EditablePermitCellProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const anchorRef = useRef<HTMLDivElement>(null);

  const currentValue = getRowValue(row, field);

  const startEditing = useCallback(() => {
    setValue(currentValue);
    setEditing(true);
  }, [currentValue]);

  const cancel = useCallback(() => setEditing(false), []);

  const save = useCallback(() => {
    if (value !== currentValue) {
      onSave(row.id, buildBody(field, value));
    }
    setEditing(false);
  }, [value, currentValue, row.id, field, onSave]);

  useEffect(() => {
    if (!editing) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      // Skip if click is inside our container
      if (anchorRef.current && anchorRef.current.contains(target)) return;
      // Skip if click is inside a MUI portal (Select dropdown menu)
      const portalEl = (target as HTMLElement).closest?.(
        '[role="listbox"], [role="presentation"], .MuiMenu-paper, .MuiPopover-paper',
      );
      if (portalEl) return;
      save();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [editing, save]);

  if (field === "isTakedAction") {
    const checked = currentValue === "yes";
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => {
          const newValue = e.target.checked ? "yes" : "no";
          onSave(row.id, buildBody(field, newValue));
        }}
        size="small"
        sx={{ padding: "4px" }}
      />
    );
  }

  if (!editing) {
    let display: string;
    if (field === "permitStatus") {
      display =
        permitStatusOptions.find((s) => s.id === row.permitStatusId)?.name ??
        row.permitStatusName ??
        "";
    } else if (field === "completionPhase") {
      display =
        completionPhases.find((p) => p.id === row.completionPhaseId)?.name ??
        row.completionPhaseName ??
        "";
    } else if (field === "phaseStatus") {
      const phaseStatuses = completionPhases.find((p) => p.id === row.completionPhaseId)?.statuses ?? [];
      display =
        phaseStatuses.find((s) => s.id === row.phaseStatusId)?.name ??
        row.phaseStatusName ??
        "";
    } else {
      display = currentValue;
    }

    return (
      <span
        onClick={startEditing}
        style={{
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          minWidth: 60,
          minHeight: 28,
          padding: "2px 8px",
          borderRadius: 4,
          border: "1px dashed rgba(25, 118, 210, 0.5)",
          backgroundColor: "rgba(25, 118, 210, 0.04)",
          transition: "border-color 0.2s, background-color 0.2s",
          fontSize: "0.875rem",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(25, 118, 210, 1)";
          e.currentTarget.style.backgroundColor = "rgba(25, 118, 210, 0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(25, 118, 210, 0.5)";
          e.currentTarget.style.backgroundColor = "rgba(25, 118, 210, 0.04)";
        }}
      >
        {display || emptyDash}
      </span>
    );
  }

  const commonSx = { minWidth: 120 };

  return (
    <div ref={anchorRef} style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {field === "permitStatus" && (
        <Select
          size="small"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (e.target.value !== currentValue) {
              onSave(row.id, buildBody(field, e.target.value));
            }
            setEditing(false);
          }}
          onClose={() => setEditing(false)}
          sx={commonSx}
          autoFocus
        >
          <MenuItem value="">
            <em>{emptyDash}</em>
          </MenuItem>
          {permitStatusOptions.map((opt) => (
            <MenuItem key={opt.id} value={String(opt.id)}>
              {opt.name}
            </MenuItem>
          ))}
        </Select>
      )}

      {(field === "startPermitDate" || field === "endPermitDate" || field === "lastDateConsultantStatement") && (
        <TextField
          size="small"
          type="date"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={commonSx}
          autoFocus
          InputLabelProps={{ shrink: true }}
        />
      )}

      {field === "countOfDaysFromAssignedDate" && (
        <TextField
          size="small"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={commonSx}
          autoFocus
        />
      )}

      {(field === "targetDrilling" || field === "achievedDrilling" || field === "targetExtention" || field === "achievedExtention") && (
        <TextField
          size="small"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={commonSx}
          autoFocus
        />
      )}

      {(field === "noteFromPermitToDepartments" ||
        field === "evaluationPermitStatus" ||
        field === "employeeName" ||
        field === "descriptionDetails" ||
        field === "consultantStatement") && (
        <TextField
          size="small"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={commonSx}
          autoFocus
        />
      )}

      {field === "completionPhase" && (
        <Select
          size="small"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (e.target.value !== currentValue) {
              onSave(row.id, buildBody(field, e.target.value));
            }
            setEditing(false);
          }}
          onClose={() => setEditing(false)}
          sx={commonSx}
          autoFocus
        >
          <MenuItem value="">
            <em>{emptyDash}</em>
          </MenuItem>
          {completionPhases.map((opt) => (
            <MenuItem key={opt.id} value={String(opt.id)}>
              {opt.name}
            </MenuItem>
          ))}
        </Select>
      )}

      {field === "phaseStatus" && (
        <Select
          size="small"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (e.target.value !== currentValue) {
              onSave(row.id, buildBody(field, e.target.value));
            }
            setEditing(false);
          }}
          onClose={() => setEditing(false)}
          sx={commonSx}
          autoFocus
        >
          <MenuItem value="">
            <em>{emptyDash}</em>
          </MenuItem>
          {(completionPhases.find((p) => p.id === row.completionPhaseId)?.statuses ?? []).map((opt) => (
            <MenuItem key={opt.id} value={String(opt.id)}>
              {opt.name}
            </MenuItem>
          ))}
        </Select>
      )}

      <Tooltip title="Save">
        <IconButton size="small" color="primary" onClick={save}>
          <Check className="w-4 h-4" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Cancel">
        <IconButton size="small" color="error" onClick={cancel}>
          <X className="w-4 h-4" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
