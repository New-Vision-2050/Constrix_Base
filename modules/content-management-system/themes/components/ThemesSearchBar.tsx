"use client";

import { CompanyDashboardCategoriesApi } from "@/services/api/company-dashboard/categories";
import { Stack, TextField, MenuItem, Menu, Button, InputAdornment } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronDown, SortAsc } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo } from "react";

interface ThemesSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
}

/**
 * Search and filter bar for themes
 * - Supports RTL/LTR automatically via MUI
 * - Light/Dark mode via theme
 * - Debounced search input
 */
export default function ThemesSearchBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sortBy,
  onSortByChange,
}: ThemesSearchBarProps) {
  const t = useTranslations("content-management-system.themes");

  // Local search state for debouncing
  const [localSearch, setLocalSearch] = useState(search);

  // Anchor elements for dropdown menus
  const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);
  const [sortByAnchor, setSortByAnchor] = useState<null | HTMLElement>(null);

  // Fetch categories with caching (5 min fresh, 10 min in cache)
  const { data: categoriesData } = useQuery({
    queryKey: ["company-dashboard-themes-categories-filter"],
    queryFn: () => CompanyDashboardCategoriesApi.list(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  const categoriesOptions = useMemo(
    () => categoriesData?.data?.payload?.map((category: any) => ({
      value: category.id,
      label: category.name,
    })) || [],
    [categoriesData]
  );

  // Debounce search: wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  const currentSortByLabel = useMemo(() => {
    if (!sortBy) return t("sortBy");
    const labels: Record<string, string> = {
      newest: t("newest"),
      oldest: t("oldest"),
    };
    return labels[sortBy] || t("sortBy");
  }, [sortBy, t]);

  // Get category label for display
  const getCategoryLabel = (value: string) => {
    return categoriesOptions.find((category: any) => category.value === value)?.label || t("allCategories");
  };

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

      {/* Category dropdown button */}
      <Button
        variant="outlined"
        size="small"
        color={undefined}
        onClick={(e) => setCategoryAnchor(e.currentTarget)}
        endIcon={<ChevronDown size={16} />}
        sx={{ minWidth: 110, justifyContent: "space-between", color: "gray", borderColor: "gray" }}
      >
        {getCategoryLabel(category)}
      </Button>
      <Menu
        anchorEl={categoryAnchor}
        open={Boolean(categoryAnchor)}
        onClose={() => setCategoryAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            onCategoryChange("");
            setCategoryAnchor(null);
          }}
        >
          {t("allCategories")}
        </MenuItem>
        {categoriesOptions.map((category) => (
          <MenuItem key={category.value} onClick={() => {
            onCategoryChange(category.value);
            setCategoryAnchor(null);
          }}>
            {category.label}
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
            onSortByChange("newest");
            setSortByAnchor(null);
          }}
        >
          {t("newest")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            onSortByChange("oldest");
            setSortByAnchor(null);
          }}
        >
          {t("oldest")}
        </MenuItem>
      </Menu>
    </Stack>
  );
}

