"use client";

import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import {
  useProjectFilters,
  type ProjectFilterValues,
} from "../hooks/useProjectFilters";

type OptionItem = { id: number | string; name: string };

interface ProjectFiltersProps {
  filterManager: ReturnType<typeof useProjectFilters>;
}

export function ProjectFilters({ filterManager }: ProjectFiltersProps) {
  const t = useTranslations();
  const {
    filters,
    setFilter,
    resetFilters,
    projectTypesData,
    subProjectTypesData,
    subSubProjectTypesData,
    managersData,
    ownerOptionsData,
  } = filterManager;

  const renderSelect = (
    label: string,
    value: string,
    onChange: (val: string) => void,
    options: OptionItem[],
    disabled?: boolean,
  ) => (
    <FormControl size="small" fullWidth disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">{t("project.all")}</MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.id} value={String(opt.id)}>
            {opt.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        p: 2.5,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {t("project.filterSearch")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RotateCcw size={14} />}
          onClick={resetFilters}
        >
          {t("project.clearFilters")}
        </Button>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {renderSelect(
          t("project.projectType"),
          filters.project_type_id,
          (val) => setFilter("project_type_id", val),
          projectTypesData,
        )}

        {renderSelect(
          t("project.subProjectType"),
          filters.sub_project_type_id,
          (val) => setFilter("sub_project_type_id", val),
          subProjectTypesData,
          !filters.project_type_id,
        )}

        {renderSelect(
          t("project.subSubProjectType"),
          filters.sub_sub_project_type_id,
          (val) => setFilter("sub_sub_project_type_id", val),
          subSubProjectTypesData,
          !filters.sub_project_type_id,
        )}

        {renderSelect(
          t("project.projectManager"),
          filters.manager_id,
          (val) => setFilter("manager_id", val),
          managersData,
        )}

        {renderSelect(
          t("project.projectOwner"),
          filters.project_owner_type,
          (val) => setFilter("project_owner_type", val),
          [
            { id: "company", name: t("project.entity") },
            { id: "individual", name: t("project.individual") },
          ],
        )}

        {renderSelect(
          t("project.selectClient"),
          filters.project_owner_id,
          (val) => setFilter("project_owner_id", val),
          ownerOptionsData,
          !filters.project_owner_type,
        )}

        {renderSelect(
          t("project.projectStatus"),
          filters.status,
          (val) => setFilter("status", val),
          [
            { id: "1", name: t("project.statusOngoing") },
            { id: "0", name: t("project.statusInProgress") },
            { id: "-1", name: t("project.statusStopped") },
            { id: "2", name: t("project.statusCompleted") },
          ],
        )}
      </Box>
    </Paper>
  );
}

export type { ProjectFilterValues };
