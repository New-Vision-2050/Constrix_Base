"use client";

import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { FormConditionOption } from "@/services/api/hr-settings/internal-procedure-settings/types/response";
import type { TaskActionConditionFormValue } from "../types";
import {
  filterConditionsForDefinitions,
  groupDefinitionsByFormGroup,
  mergeGroupConditionChanges,
} from "../utils/conditionFormUtils";
import FormConditionsTable from "./FormConditionsTable";

interface FormConditionsSectionProps {
  definitions: FormConditionOption[];
  conditions: TaskActionConditionFormValue[];
  onChange: (conditions: TaskActionConditionFormValue[]) => void;
  disabled?: boolean;
  defaultGroupLabel: string;
  labels: {
    sortOrder: string;
    status: string;
    condition: string;
    conditionType: string;
    settings: string;
  };
}

export default function FormConditionsSection({
  definitions,
  conditions,
  onChange,
  disabled = false,
  defaultGroupLabel,
  labels,
}: FormConditionsSectionProps) {
  const groups = useMemo(
    () => groupDefinitionsByFormGroup(definitions, defaultGroupLabel),
    [definitions, defaultGroupLabel],
  );

  const [activeGroupKey, setActiveGroupKey] = useState(groups[0]?.key ?? "default");

  useEffect(() => {
    if (!groups.some((group) => group.key === activeGroupKey)) {
      setActiveGroupKey(groups[0]?.key ?? "default");
    }
  }, [groups, activeGroupKey]);

  const activeGroup =
    groups.find((group) => group.key === activeGroupKey) ?? groups[0];

  if (!activeGroup) return null;

  const activeConditions = filterConditionsForDefinitions(
    conditions,
    activeGroup.definitions,
  );

  const handleGroupChange = (
    updatedGroupConditions: TaskActionConditionFormValue[],
  ) => {
    onChange(
      mergeGroupConditionChanges(
        conditions,
        activeGroup.definitions,
        updatedGroupConditions,
      ),
    );
  };

  if (groups.length <= 1) {
    return (
      <FormConditionsTable
        definitions={activeGroup.definitions}
        conditions={activeConditions}
        onChange={handleGroupChange}
        disabled={disabled}
        labels={labels}
      />
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Tabs
        value={activeGroup.key}
        onChange={(_, value: string) => setActiveGroupKey(value)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {groups.map((group) => (
          <Tab key={group.key} value={group.key} label={group.label} />
        ))}
      </Tabs>

      <FormConditionsTable
        definitions={activeGroup.definitions}
        conditions={activeConditions}
        onChange={handleGroupChange}
        disabled={disabled}
        labels={labels}
      />
    </Box>
  );
}
