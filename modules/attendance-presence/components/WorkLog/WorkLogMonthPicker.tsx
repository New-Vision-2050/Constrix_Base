"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  IconButton,
  Popover,
  alpha,
  useTheme,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { useLocale, useTranslations } from "next-intl";
import { useAttendancePresence } from "../../context/AttendancePresenceContext";
import { formatMonthYear } from "../../utils/calendar";
import { useAttendanceDirection } from "../../utils/direction";
import WorkLogMonthYearPickerPanel from "./WorkLogMonthYearPickerPanel";

export default function WorkLogMonthPicker() {
  const t = useTranslations("AttendancePresence");
  const locale = useLocale();
  const theme = useTheme();
  const { isRtl } = useAttendanceDirection();
  const { selectedMonth, setSelectedMonth } = useAttendancePresence();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);
  const selectedYear = selectedMonth.getFullYear();
  const selectedMonthIndex = selectedMonth.getMonth();
  const monthLabel = formatMonthYear(selectedMonth, locale);

  const PrevIcon = isRtl ? KeyboardArrowRight : KeyboardArrowLeft;
  const NextIcon = isRtl ? KeyboardArrowLeft : KeyboardArrowRight;

  const navButtonSx = useMemo(
    () => ({
      color: "text.secondary",
      p: 0.75,
      "&:hover": {
        color: "text.primary",
        bgcolor: alpha(theme.palette.common.white, 0.06),
      },
    }),
    [theme.palette.common.white],
  );

  const changeMonth = (delta: number) => {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + delta, 1),
    );
  };

  const selectYear = (year: number) => {
    setSelectedMonth(new Date(year, selectedMonthIndex, 1));
  };

  const selectMonth = (monthIndex: number) => {
    setSelectedMonth(new Date(selectedYear, monthIndex, 1));
    setAnchorEl(null);
  };

  return (
    <Box
      dir={isRtl ? "rtl" : "ltr"}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.25,
        borderRadius: 2,
        bgcolor: alpha(theme.palette.background.paper, 0.72),
        border: "1px solid",
        borderColor: alpha(theme.palette.divider, 0.45),
        px: 0.5,
        py: 0.25,
      }}
    >
      <IconButton
        size="small"
        aria-label="Previous month"
        onClick={() => changeMonth(-1)}
        sx={navButtonSx}
      >
        <PrevIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <Box
        component="button"
        type="button"
        aria-label="Select month and year"
        aria-expanded={open}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          minWidth: "7.5rem",
          px: 0.75,
          py: 0.5,
          border: 0,
          borderRadius: 1.5,
          bgcolor: "transparent",
          color: "text.primary",
          cursor: "pointer",
          transition: theme.transitions.create(["background-color", "color"], {
            duration: theme.transitions.duration.shorter,
          }),
          "&:hover": {
            bgcolor: alpha(theme.palette.common.white, 0.06),
          },
        }}
      >
        <KeyboardArrowDown
          sx={{
            fontSize: 16,
            color: "text.secondary",
            transition: theme.transitions.create("transform", {
              duration: theme.transitions.duration.shorter,
            }),
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
        <Box
          component="span"
          sx={{
            fontSize: "0.875rem",
            fontWeight: 600,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          {monthLabel}
        </Box>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: isRtl ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: isRtl ? "right" : "left",
        }}
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              mt: 1,
              width: 292,
              overflow: "hidden",
              borderRadius: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.98),
              backgroundImage: "none",
              border: "1px solid",
              borderColor: alpha(theme.palette.divider, 0.5),
              boxShadow: `0 16px 40px ${alpha(theme.palette.common.black, 0.45)}`,
            },
          },
        }}
      >
        <WorkLogMonthYearPickerPanel
          locale={locale}
          isRtl={isRtl}
          isOpen={open}
          selectedYear={selectedYear}
          selectedMonthIndex={selectedMonthIndex}
          yearLabel={t("pickerYear")}
          monthLabel={t("pickerMonth")}
          onSelectYear={selectYear}
          onSelectMonth={selectMonth}
        />
      </Popover>

      <IconButton
        size="small"
        aria-label="Next month"
        onClick={() => changeMonth(1)}
        sx={navButtonSx}
      >
        <NextIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
}
