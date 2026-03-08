"use client";

import { Stack, TextField, MenuItem, Menu, Button, InputAdornment } from "@mui/material";
import { Search, ChevronDown, SortAsc } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import { apiClient, baseURL } from "@/config/axios-config";

interface PropsT {
    /** Current search query */
    search: string;
    /** Callback when search changes */
    onSearchChange: (value: string) => void;
    /** Current selected project type filter */
    CategoryType: string;
    /** Callback when project type filter changes */
    onCategoryTypeChange: (value: string) => void;
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
export default function IconsSearchBar({
    search,
    onSearchChange,
    CategoryType,
    onCategoryTypeChange,
    sortBy,
    onSortByChange,
    actions,
}: PropsT) {
    const t = useTranslations("content-management-system.projects");

    // Local search state for debouncing (avoids API call on every keystroke)
    const [localSearch, setLocalSearch] = useState(search);

    // Anchor elements for dropdown menus
    const [CategoryTypeAnchor, setCategoryTypeAnchor] = useState<null | HTMLElement>(null);
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
    const { data: CategoryTypesData } = useQuery({
        queryKey: ["company-dashboard-categories"],
        queryFn: async () => {
            const response = await apiClient.get(baseURL + '/website-icons/category-types');
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const CategoryTypeOptions = useMemo(
        () => {
            return CategoryTypesData?.payload || []
        },
        [CategoryTypesData]
    );

    // Get current labels for display
    const currentCategoryTypeLabel = useMemo(() => {
        if (!CategoryType) return t("CategoryType");
        const type = CategoryTypeOptions.find((t: any) => t.id === CategoryType);
        return type?.name || t("CategoryType");
    }, [CategoryType, CategoryTypeOptions, t]);

    const currentSortByLabel = useMemo(() => {
        if (!sortBy) return t("sortBy");
        const labels: Record<string, string> = {
            asc: t("asc"),
            desc: t("desc"),
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
                sx={{ minWidth: 200, flexGrow: 1 }}
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
                onClick={(e) => setCategoryTypeAnchor(e.currentTarget)}
                endIcon={<ChevronDown size={16} />}
                sx={{ minWidth: 110, justifyContent: "space-between", color: "gray", borderColor: "gray" }}
            >
                {currentCategoryTypeLabel}
            </Button>
            <Menu
                anchorEl={CategoryTypeAnchor}
                open={Boolean(CategoryTypeAnchor)}
                onClose={() => setCategoryTypeAnchor(null)}
            >
                <MenuItem
                    onClick={() => {
                        onCategoryTypeChange("");
                        setCategoryTypeAnchor(null);
                    }}
                >
                    {t("allTypes")}
                </MenuItem>
                {CategoryTypeOptions.map((type: any) => (
                    <MenuItem
                        key={type.id}
                        onClick={() => {
                            if (type.id == CategoryType)
                                onCategoryTypeChange("");
                            else
                                onCategoryTypeChange(type.id);
                            setCategoryTypeAnchor(null);
                        }}
                    >
                        {type.name}
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
                    {t("sortBy")}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        onSortByChange("asc");
                        setSortByAnchor(null);
                    }}
                >
                    {t("asc")}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        onSortByChange("desc");
                        setSortByAnchor(null);
                    }}
                >
                    {t("desc")}
                </MenuItem>
            </Menu>
        </Stack>
    );
}
