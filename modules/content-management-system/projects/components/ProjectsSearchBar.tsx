"use client";

import { Stack, TextField, MenuItem, Select, FormControl, InputLabel, InputAdornment } from "@mui/material";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { CompanyDashboardProjectTypesApi } from "@/services/api/company-dashboard/project-types";

interface ProjectsSearchBarProps {
    /** Current search query */
    search: string;
    /** Callback when search changes */
    onSearchChange: (value: string) => void;
    /** Current selected project type filter */
    projectType: string;
    /** Callback when project type filter changes */
    onProjectTypeChange: (value: string) => void;
    /** Current selected sort by filter */
    sortBy: string;
    /** Callback when sort by filter changes */
    onSortByChange: (value: string) => void;
    /** additional actions */
    actions?: React.ReactNode;
}

/**
 * Search and filter bar for projects
 * - Supports RTL/LTR automatically via MUI
 * - Light/Dark mode via theme
 * - Fetches project types with caching
 */
export default function ProjectsSearchBar({
    search,
    onSearchChange,
    projectType,
    onProjectTypeChange,
    sortBy,
    onSortByChange,
    actions,
}: ProjectsSearchBarProps) {
    const t = useTranslations("content-management-system.projects");

    // Fetch project types with caching (5 min fresh, 10 min in cache)
    const { data: projectTypesData } = useQuery({
        queryKey: ["company-dashboard-project-types-filter"],
        queryFn: () => CompanyDashboardProjectTypesApi.list(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const projectTypeOptions = useMemo(
        () => projectTypesData?.data?.payload || [],
        [projectTypesData]
    );

    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="stretch"
            sx={{ mb: 3 }}
            className="bg-sidebar p-4 rounded-lg"
        >
            {/* Search input */}
            <TextField
                fullWidth
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                InputProps={{
                    size: "small",
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search size={20} />
                        </InputAdornment>
                    ),
                }}
            />
            {/* additional actions */}
            {actions && <>{actions}</>}
            
            {/* Project type filter */}
            <FormControl sx={{ minWidth: 200 }}>
                <InputLabel size="small">{t("projectType")}</InputLabel>
                <Select
                    value={projectType}
                    size="small"
                    label={t("projectType")}
                    onChange={(e) => onProjectTypeChange(e.target.value)}
                >
                    <MenuItem value="">{t("allTypes")}</MenuItem>
                    {projectTypeOptions.map((type: any) => (
                        <MenuItem key={type.id} value={type.id}>
                            {type.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Sort by */}
            <FormControl sx={{ minWidth: 200 }}>
                <InputLabel size="small">{t("sortBy")}</InputLabel>
                <Select
                    value={sortBy}
                    size="small"
                    label={t("sortBy")}
                    onChange={(e) => onSortByChange(e.target.value)}
                >
                    <MenuItem value="">{t("all")}</MenuItem>
                    <MenuItem value="name">{t("name")}</MenuItem>
                    <MenuItem value="createdAt">{t("createdAt")}</MenuItem>
                </Select>
            </FormControl>
        </Stack>
    );
}
