"use client";

import React, { useEffect, useMemo, useRef } from "react";
import {
  Box,
  ButtonBase,
  Divider,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  buildYearOptions,
  getLocalizedMonthNames,
} from "../../utils/calendar";
import { formatLocalizedNumber } from "../../utils/i18n";

interface WorkLogMonthYearPickerPanelProps {
  locale: string;
  isRtl: boolean;
  isOpen: boolean;
  selectedYear: number;
  selectedMonthIndex: number;
  yearLabel: string;
  monthLabel: string;
  onSelectYear: (year: number) => void;
  onSelectMonth: (monthIndex: number) => void;
}

function PickerGridItem({
  selected,
  onClick,
  children,
  itemRef,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  itemRef?: React.Ref<HTMLButtonElement>;
}) {
  const theme = useTheme();

  return (
    <ButtonBase
      ref={itemRef}
      onClick={onClick}
      sx={{
        width: "100%",
        borderRadius: 1.5,
        py: 1.1,
        px: 0.5,
        minHeight: 38,
        fontSize: "0.8125rem",
        lineHeight: 1.25,
        fontWeight: selected ? 700 : 400,
        color: selected ? theme.palette.common.white : theme.palette.text.secondary,
        bgcolor: selected ? alpha(theme.palette.common.white, 0.14) : "transparent",
        border: "1px solid",
        borderColor: selected
          ? alpha(theme.palette.common.white, 0.1)
          : "transparent",
        transition: theme.transitions.create(["background-color", "color", "border-color"], {
          duration: theme.transitions.duration.shorter,
        }),
        "&:hover": {
          bgcolor: selected
            ? alpha(theme.palette.common.white, 0.18)
            : alpha(theme.palette.common.white, 0.06),
        },
      }}
    >
      {children}
    </ButtonBase>
  );
}

export default function WorkLogMonthYearPickerPanel({
  locale,
  isRtl,
  isOpen,
  selectedYear,
  selectedMonthIndex,
  yearLabel,
  monthLabel,
  onSelectYear,
  onSelectMonth,
}: WorkLogMonthYearPickerPanelProps) {
  const theme = useTheme();
  const yearRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const years = useMemo(() => buildYearOptions(selectedYear), [selectedYear]);
  const monthNames = useMemo(
    () => getLocalizedMonthNames(locale, "long"),
    [locale],
  );

  useEffect(() => {
    if (!isOpen) return;

    const selectedYearButton = yearRefs.current.get(selectedYear);
    selectedYearButton?.scrollIntoView({ block: "center" });
  }, [isOpen, selectedYear]);

  return (
    <Box dir={isRtl ? "rtl" : "ltr"}>
      <Box sx={{ px: 2, pt: 1.75, pb: 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mb: 1.25,
            fontWeight: 600,
            color: "text.secondary",
            textAlign: isRtl ? "right" : "left",
          }}
        >
          {yearLabel}
        </Typography>

        <Box
          sx={{
            maxHeight: 132,
            overflowY: "auto",
            pr: isRtl ? 0 : 0.25,
            pl: isRtl ? 0.25 : 0,
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-track": {
              bgcolor: alpha(theme.palette.common.white, 0.04),
              borderRadius: 999,
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: alpha(theme.palette.common.white, 0.22),
              borderRadius: 999,
            },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 1,
            }}
          >
            {years.map((year) => (
              <PickerGridItem
                key={year}
                selected={year === selectedYear}
                onClick={() => onSelectYear(year)}
                itemRef={(node) => {
                  if (node) {
                    yearRefs.current.set(year, node);
                  } else {
                    yearRefs.current.delete(year);
                  }
                }}
              >
                {formatLocalizedNumber(year, locale, { useGrouping: false })}
              </PickerGridItem>
            ))}
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.35) }} />

      <Box sx={{ px: 2, pt: 1.5, pb: 1.75 }}>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mb: 1.25,
            fontWeight: 600,
            color: "text.secondary",
            textAlign: isRtl ? "right" : "left",
          }}
        >
          {monthLabel}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 1,
          }}
        >
          {monthNames.map((name, monthIndex) => (
            <PickerGridItem
              key={name}
              selected={monthIndex === selectedMonthIndex}
              onClick={() => onSelectMonth(monthIndex)}
            >
              {name}
            </PickerGridItem>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
