"use client";

import { Stack, TextField, MenuItem, Menu, Button, InputAdornment } from "@mui/material";
import { Search, ChevronDown, SortAsc } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
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
    /** Additional actions */
    actions?: React.ReactNode;
}

/**
 * Search and filter bar for projects
 * - Uses Button with dropdown Menu instead of Select
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

    // Local search state for debouncing (avoids API call on every keystroke)
    const [localSearch, setLocalSearch] = useState(search);

    // Anchor elements for dropdown menus
    const [projectTypeAnchor, setProjectTypeAnchor] = useState<null | HTMLElement>(null);
    const [sortByAnchor, setSortByAnchor] = useState<null | HTMLElement>(null);

    // Debounce search: wait 500ms after user stops typing before updating parent
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchChange(localSearch);
        }, 500);

        // Cleanup: cancel timer if user types again before 500ms
        return () => clearTimeout(timer);
    }, [localSearch, onSearchChange]);

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

    // Get current labels for display
    const currentProjectTypeLabel = useMemo(() => {
        if (!projectType) return t("projectType");
        const type = projectTypeOptions.find((t: any) => t.id === projectType);
        return type?.name_ar || type?.name_en || t("projectType");
    }, [projectType, projectTypeOptions, t]);

    const currentSortByLabel = useMemo(() => {
        if (!sortBy) return t("sortBy");
        const labels: Record<string, string> = {
            name: t("name"),
            createdAt: t("createdAt"),
        };
        return labels[sortBy] || t("sortBy");
    }, [sortBy, t]);

    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="stretch"
            sx={{ mb: 3 }}
            flexWrap={"wrap"}
            className="bg-sidebar p-4 rounded-lg"
        >
            {/* Search input with debouncing */}
            <TextField
                sx={{ minWidth: 200,flexGrow: 1 }}
                size="small"
                placeholder={t("searchPlaceholder")}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search size={20} />
                        </InputAdornment>
                    ),
                }}
            />

            {/* Additional actions (e.g., Add button) */}
            {actions && <>{actions}</>}

            {/* Project type dropdown button */}
            <Button
                variant="outlined"
                size="small"
                color={undefined}
                onClick={(e) => setProjectTypeAnchor(e.currentTarget)}
                endIcon={<ChevronDown size={16} />}
                sx={{ minWidth: 110, justifyContent: "space-between", color: "gray", borderColor: "gray" }}
            >
                {currentProjectTypeLabel}
            </Button>
            <Menu
                anchorEl={projectTypeAnchor}
                open={Boolean(projectTypeAnchor)}
                onClose={() => setProjectTypeAnchor(null)}
            >
                <MenuItem
                    onClick={() => {
                        onProjectTypeChange("");
                        setProjectTypeAnchor(null);
                    }}
                >
                    {t("allTypes")}
                </MenuItem>
                {projectTypeOptions.map((type: any) => (
                    <MenuItem
                        key={type.id}
                        onClick={() => {
                            onProjectTypeChange(type.id);
                            setProjectTypeAnchor(null);
                        }}
                    >
                        {type.name_ar || type.name_en}
                    </MenuItem>
                ))}
            </Menu>

            {/* Sort by dropdown button */}
            <Button
                variant="outlined"
                size="small"
                color={undefined}
                onClick={(e) => setSortByAnchor(e.currentTarget)}
                endIcon={<ChevronDown size={16} />}
                startIcon={<SortAsc size={16} />}
                sx={{ minWidth: 110, justifyContent: "space-between", color: "gray", borderColor: "gray" }}
            >
                {currentSortByLabel}
            </Button>
            <Menu
                anchorEl={sortByAnchor}
                open={Boolean(sortByAnchor)}
                onClose={() => setSortByAnchor(null)}
            >
                <MenuItem
                    onClick={() => {
                        onSortByChange("");
                        setSortByAnchor(null);
                    }}
                >
                    {t("all")}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        onSortByChange("name");
                        setSortByAnchor(null);
                    }}
                >
                    {t("name")}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        onSortByChange("createdAt");
                        setSortByAnchor(null);
                    }}
                >
                    {t("createdAt")}
                </MenuItem>
            </Menu>
        </Stack>
    );
}
