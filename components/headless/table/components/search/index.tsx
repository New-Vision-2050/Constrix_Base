import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { SearchProps } from "./types";

// ============================================================================
// Search Component
// ============================================================================

export function createSearchComponent() {
  const SearchComponent = ({ search, placeholder }: SearchProps) => {
    const t = useTranslations("Table");

    return (
      <TextField
        fullWidth
        size="small"
        placeholder={placeholder || t("Search")}
        value={search.search}
        onChange={(e) => search.setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
    );
  };

  return SearchComponent;
}
