"use client";

import React, { useCallback, useMemo } from "react";
import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";
import type { DropdownOption } from "./types";
import { usePaginatedConstraintOptions } from "./usePaginatedConstraintOptions";

type PaginatedConstraintAutocompleteProps = {
  selectedId?: string;
  placeholder: string;
  onChange: (value: DropdownOption | null) => void;
};

export function PaginatedConstraintAutocomplete({
  selectedId,
  placeholder,
  onChange,
}: PaginatedConstraintAutocompleteProps) {
  const {
    options,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = usePaginatedConstraintOptions();

  const value = useMemo(() => {
    const id = String(selectedId ?? "").trim();
    if (!id) return null;
    return options.find((option) => option.id === id) ?? null;
  }, [options, selectedId]);

  const observerRef = React.useRef<IntersectionObserver | null>(null);

  const attachLastOptionRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node || !hasNextPage) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
          }
        },
        { root: node.parentElement, threshold: 0.1 },
      );

      observerRef.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, options.length],
  );

  const handleListboxScroll = useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      const target = event.currentTarget;
      const nearBottom =
        target.scrollTop + target.clientHeight >= target.scrollHeight - 40;

      if (nearBottom && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  const ListboxComponent = useMemo(
    () =>
      React.forwardRef<
        HTMLUListElement,
        React.HTMLAttributes<HTMLElement>
      >(function ConstraintListbox(props, ref) {
        const { children, onScroll, style, ...rest } = props;

        return (
          <ul
            ref={ref}
            {...rest}
            onScroll={(event) => {
              onScroll?.(event);
              handleListboxScroll(event);
            }}
            style={{
              ...style,
              maxHeight: 240,
              overflow: "auto",
              margin: 0,
              padding: 0,
              listStyle: "none",
            }}
          >
            {children}
          </ul>
        );
      }),
    [handleListboxScroll],
  );

  return (
    <Autocomplete
      fullWidth
      size="small"
      loading={isLoading}
      options={options}
      filterOptions={(opts) => opts}
      getOptionLabel={(option) => option.name}
      getOptionKey={(option) => option.id}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      value={value}
      ListboxComponent={
        ListboxComponent as React.ComponentType<
          React.HTMLAttributes<HTMLElement>
        >
      }
      onChange={(_, next) => onChange(next)}
      renderOption={(props, option, state) => {
        const { key, ...optionProps } = props;
        const isLast = state.index === options.length - 1;

        return (
          <Box
            component="li"
            key={key}
            {...optionProps}
            ref={isLast ? attachLastOptionRef : undefined}
          >
            {option.name}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading || isFetchingNextPage ? (
                  <CircularProgress color="inherit" size={16} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
