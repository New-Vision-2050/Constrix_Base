"use client";

import {
  Box,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import {
  useProjectFilters,
  type ProjectFilterValues,
} from "../hooks/useProjectFilters";
import SearchableSelect from "@/components/shared/SearchableSelect";

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
        <SearchableSelect
          label={t("project.projectType")}
          value={filters.project_type_id}
          onChange={(val) => setFilter("project_type_id", String(val))}
          placeholder={t("project.all")}
          options={[
            { value: "", label: t("project.all") },
            ...projectTypesData.map((opt) => ({
              value: String(opt.id),
              label: opt.name,
            })),
          ]}
        />

        <SearchableSelect
          label={t("project.subProjectType")}
          value={filters.sub_project_type_id}
          onChange={(val) => setFilter("sub_project_type_id", String(val))}
          placeholder={t("project.all")}
          disabled={!filters.project_type_id}
          options={[
            { value: "", label: t("project.all") },
            ...subProjectTypesData.map((opt) => ({
              value: String(opt.id),
              label: opt.name,
            })),
          ]}
        />

        <SearchableSelect
          label={t("project.subSubProjectType")}
          value={filters.sub_sub_project_type_id}
          onChange={(val) => setFilter("sub_sub_project_type_id", String(val))}
          placeholder={t("project.all")}
          disabled={!filters.sub_project_type_id}
          options={[
            { value: "", label: t("project.all") },
            ...subSubProjectTypesData.map((opt) => ({
              value: String(opt.id),
              label: opt.name,
            })),
          ]}
        />

        <SearchableSelect
          label={t("project.projectManager")}
          value={filters.manager_id}
          onChange={(val) => setFilter("manager_id", String(val))}
          placeholder={t("project.all")}
          options={[
            { value: "", label: t("project.all") },
            ...managersData.map((m) => ({
              value: String(m.id),
              label: m.name,
            })),
          ]}
        />

        <SearchableSelect
          label={t("project.projectOwner")}
          value={filters.project_owner_type}
          onChange={(val) => setFilter("project_owner_type", String(val))}
          placeholder={t("project.all")}
          options={[
            { value: "", label: t("project.all") },
            { value: "company", label: t("project.entity") },
            { value: "individual", label: t("project.individual") },
          ]}
        />

        <SearchableSelect
          label={t("project.selectClient")}
          value={filters.project_owner_id}
          onChange={(val) => setFilter("project_owner_id", String(val))}
          placeholder={t("project.all")}
          disabled={!filters.project_owner_type}
          options={[
            { value: "", label: t("project.all") },
            ...ownerOptionsData.map((o) => ({
              value: String(o.id),
              label: o.name,
            })),
          ]}
        />

        <SearchableSelect
          label={t("project.projectStatus")}
          value={filters.status}
          onChange={(val) => setFilter("status", String(val))}
          placeholder={t("project.all")}
          options={[
            { value: "", label: t("project.all") },
            { value: "1", label: t("project.statusOngoing") },
            { value: "0", label: t("project.statusInProgress") },
            { value: "-1", label: t("project.statusStopped") },
            { value: "2", label: t("project.statusCompleted") },
          ]}
        />
      </Box>
    </Paper>
  );
}

export type { ProjectFilterValues };
