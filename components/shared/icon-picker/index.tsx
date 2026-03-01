"use client";

import { useState } from "react";
import {
  Box,
  IconButton,
  FormHelperText,
  Collapse,
  Typography,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { APP_ICONS } from "@/constants/icons";

const COLLAPSED_COUNT = 8;

interface IconPickerProps {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
}

export default function IconPicker({
  value,
  onChange,
  disabled = false,
  error,
  label = "اختيار Icon",
}: IconPickerProps) {
  const [expanded, setExpanded] = useState(false);

  const selectedIndex = APP_ICONS.findIndex((icon) => icon.id === value);
  const selectedIsOutsideFirst7 = selectedIndex >= COLLAPSED_COUNT - 1;

  // When collapsed:
  // - Always show first 7 icons (indices 0–6)
  // - 8th slot: selected icon (if outside first 7), otherwise icons[7]
  const collapsedIcons = selectedIsOutsideFirst7
    ? [
        ...APP_ICONS.slice(0, COLLAPSED_COUNT - 1),
        APP_ICONS[selectedIndex],
      ]
    : APP_ICONS.slice(0, COLLAPSED_COUNT);

  const visibleIcons = expanded ? APP_ICONS : collapsedIcons;

  return (
    <Box>
      {label && (
        <Typography
          variant="body2"
          color={error ? "error" : "text.secondary"}
          sx={{ mb: 1 }}
        >
          {label}
        </Typography>
      )}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {visibleIcons.map((icon) => {
          const IconComponent = icon.component;
          const isSelected = value === icon.id;
          return (
            <IconButton
              key={icon.id}
              onClick={() => onChange(icon.id)}
              disabled={disabled}
              sx={{
                border: 1,
                borderRadius: 1,
                borderColor: isSelected ? "primary.main" : "divider",
                bgcolor: isSelected ? "primary.main" : "transparent",
                color: isSelected ? "primary.contrastText" : "text.secondary",
                p: 1,
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: isSelected ? "primary.dark" : "action.hover",
                },
              }}
            >
              <IconComponent size={22} color="inherit" />
            </IconButton>
          );
        })}

        {!expanded && APP_ICONS.length > COLLAPSED_COUNT && (
          <Button
            onClick={() => setExpanded(true)}
            disabled={disabled}
            size="small"
            variant="outlined"
            endIcon={<ExpandMoreIcon />}
            sx={{ borderRadius: 1, alignSelf: "center", px: 1.5 }}
          >
            {APP_ICONS.length - COLLAPSED_COUNT}+
          </Button>
        )}

        {expanded && (
          <Button
            onClick={() => setExpanded(false)}
            disabled={disabled}
            size="small"
            variant="outlined"
            endIcon={<ExpandLessIcon />}
            sx={{ borderRadius: 1, alignSelf: "center", px: 1.5 }}
          >
            عرض أقل
          </Button>
        )}
      </Box>

      {error && (
        <FormHelperText error sx={{ mt: 0.5 }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
}
