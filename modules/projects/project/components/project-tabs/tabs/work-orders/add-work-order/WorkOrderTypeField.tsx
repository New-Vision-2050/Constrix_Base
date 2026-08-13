"use client";

import { useEffect, useMemo } from "react";
import { MenuItem, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { useDebouncedValue } from "@/modules/table/hooks/useDebounce";
import {
  getOrderPermitLabel,
  useOrderPermitsByName,
} from "@/modules/projects/project/query/useOrderPermitOptions";
import type { ProjectOrderPermitTypeDto } from "@/services/api/projects/project-order-permits/types/response";

const SEARCH_DEBOUNCE_MS = 400;

export default function WorkOrderTypeField({
  workOrderName,
  value,
  fallbackOptions,
  onChange,
}: {
  workOrderName: string;
  value: string;
  fallbackOptions: ProjectOrderPermitTypeDto[];
  onChange: (workOrderType: string) => void;
}) {
  const tFields = useTranslations("project.workOrdersTab.dialog.fields");
  const debouncedName = useDebouncedValue(workOrderName.trim(), SEARCH_DEBOUNCE_MS);
  const filteredQuery = useOrderPermitsByName(debouncedName);

  const options = useMemo(() => {
    if (debouncedName.length >= 2 && filteredQuery.data) {
      return filteredQuery.data;
    }
    return fallbackOptions;
  }, [debouncedName, fallbackOptions, filteredQuery.data]);

  useEffect(() => {
    if (debouncedName.length < 2 || !filteredQuery.data?.length) return;

    const stillValid = filteredQuery.data.some(
      (item) => String(item.id) === value,
    );
    if (stillValid) return;

    if (filteredQuery.data.length === 1) {
      onChange(String(filteredQuery.data[0].id));
    }
  }, [debouncedName, filteredQuery.data, onChange, value]);

  return (
    <TextField
      select
      value={options.some((item) => String(item.id) === value) ? value : ""}
      onChange={(e) => onChange(e.target.value)}
      size="small"
      fullWidth
      disabled={filteredQuery.isLoading}
    >
      <MenuItem value="">
        <em>{tFields("selectType")}</em>
      </MenuItem>
      {options.map((item) => (
        <MenuItem key={item.id} value={String(item.id)}>
          {getOrderPermitLabel(item)}
        </MenuItem>
      ))}
    </TextField>
  );
}
