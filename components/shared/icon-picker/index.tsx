"use client";

import { useState } from "react";
import {
  Box,
  IconButton,
  FormHelperText,
  Typography,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { APP_ICONS } from "@/constants/icons";
import { useTranslations } from "next-intl";

const COLLAPSED_COUNT = 8;

interface IconPickerProps {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  icons?: typeof APP_ICONS;
}

export default function IconPicker({
  value,
  onChange,
  disabled = false,
  error,
  label = "اختيار Icon",
  icons = APP_ICONS,
}: IconPickerProps) {
  const t = useTranslations("labels");
  const [expanded, setExpanded] = useState(false);

  const selectedIndex = icons.findIndex((icon) => icon.id === value);
  const selectedIsOutsideFirst7 = selectedIndex >= COLLAPSED_COUNT - 1;

  // When collapsed:
  // - Always show first 7 icons (indices 0–6)
  // - 8th slot: selected icon (if outside first 7), otherwise icons[7]
  const collapsedIcons = selectedIsOutsideFirst7
    ? [
        ...icons.slice(0, COLLAPSED_COUNT - 1),
        icons[selectedIndex],
      ]
    : icons.slice(0, COLLAPSED_COUNT);

  const visibleIcons = expanded ? icons : collapsedIcons;

  return (
    <Box>
      {label && (
        <Typography
          variant="body2"
          color={error ? "error" : "text.secondary"}
          sx={{ mb: 1 }}
          >
          {t("chooseIcon")}
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

        {!expanded && icons.length > COLLAPSED_COUNT && (
          <Button
            onClick={() => setExpanded(true)}
            disabled={disabled}
            size="small"
            variant="outlined"
            endIcon={<ExpandMoreIcon />}
            sx={{ borderRadius: 1, alignSelf: "center", px: 1.5 }}
          >
            {icons.length - COLLAPSED_COUNT}+
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
            {t("showLess")}
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
