"use client";

import { useState, useMemo, Suspense } from "react";
import { useTranslations } from "next-intl";
import { Pagination, Stack } from "@mui/material";
import useThemes from "../hooks/useThemes";
import { StateLoading, StateError } from "@/components/shared/states";
import ThemesSearchBar from "./ThemesSearchBar";
import ThemesGrid from "./ThemesGrid";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import Can from "@/lib/permissions/client/Can";
import { useRouter } from "next/navigation";

/**
 * Main themes view component
 * - Displays search bar, themes grid, and pagination
 * - Handles theme click (logs theme ID to console)
 * - Supports RTL/LTR and Light/Dark modes
 */
export default function ThemesView() {
    const router = useRouter();
    // Pagination and filter state
    const [page, setPage] = useState(1);
    const [limit] = useState(9);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sortBy, setSortBy] = useState("");

    // Fetch themes with caching
    const {
        data: themesData,
        isLoading,
        isError,
        error,
        refetch,
    } = useThemes(page, limit, search, category, sortBy);

    const themes = useMemo(() => themesData?.data?.payload || [], [themesData]);
    const totalPages = useMemo(
        () => themesData?.data?.pagination?.last_page || 1,
        [themesData]
    );

    // Handle theme card click - log ID to console
    const handleThemeClick = (id: string) => {
        // redirect to the theme detail page
        router.push(`/content-management-system/themes/${id}`);
    };

    if (isError) {
        return <StateError message={error?.message} onRetry={refetch} />;
    }

    return (
        <Stack gap={4}>
            {/* Search and filters */}
            <ThemesSearchBar
                search={search}
                onSearchChange={setSearch}
                category={category}
                onCategoryChange={setCategory}
                sortBy={sortBy}
                onSortByChange={setSortBy}
            />
            {isLoading ? <StateLoading /> : (
                <Can check={[PERMISSIONS.CMS.themes.list]}>
                    {/* Themes grid */}
                    <ThemesGrid themes={themes} onThemeClick={handleThemeClick} />
                    {/* MUI Pagination - supports RTL automatically */}
                    <Stack direction="row" justifyContent="center" mt={3}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, newPage) => setPage(newPage)}
                            color="primary"
                            shape="rounded"
                        />
                    </Stack>
                </Can>
            )}
        </Stack>
    );
}

