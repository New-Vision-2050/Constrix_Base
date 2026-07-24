import React, { useState, useRef, useEffect, useMemo } from "react";
import { useLocale } from "next-intl";
import {
  Box,
  Checkbox,
  Typography,
  InputAdornment,
  TextField,
  Paper,
  FormLabel,
  FormHelperText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export interface Option {
  value: string | number;
  label: string;
}

function valuesMatch(a: string | number, b: string | number): boolean {
  return String(a) === String(b);
}

interface SearchableSelectBaseProps {
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  label?: string;
  name?: string;
  error?: string;
  defaultValue?: string | number;
  displayLabel?: string;
  searchable?: boolean;
}

interface SingleSearchableSelectProps extends SearchableSelectBaseProps {
  multiple?: false;
  value: string | number;
  onChange: (value: string | number) => void;
}

interface MultipleSearchableSelectProps extends SearchableSelectBaseProps {
  multiple: true;
  value: Array<string | number>;
  onChange: (value: Array<string | number>) => void;
}

type SearchableSelectProps =
  | SingleSearchableSelectProps
  | MultipleSearchableSelectProps;

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  defaultValue,
  placeholder = "اختر عنصر",
  searchPlaceholder = "البحث...",
  noResultsText = "لا توجد نتائج",
  disabled = false,
  className = "",
  required = false,
  label,
  name,
  error,
  displayLabel: displayLabelProp,
  searchable = true,
  multiple = false,
}) => {
  const theme = useTheme();
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedValues = useMemo(
    () => (multiple ? (Array.isArray(value) ? value : []) : []),
    [multiple, value],
  );

  const selectedOption = !multiple
    ? options.find((opt) => valuesMatch(opt.value, value as string | number))
    : undefined;

  const defaultValueOption = defaultValue
    ? options.find((opt) => valuesMatch(opt.value, defaultValue))
    : undefined;

  const displayTrim = displayLabelProp?.trim();

  const mainLabel = useMemo(() => {
    if (displayTrim) return displayTrim;

    if (multiple) {
      if (selectedValues.length === 0) return placeholder;
      return selectedValues
        .map(
          (selectedValue) =>
            options.find((opt) => valuesMatch(opt.value, selectedValue))?.label,
        )
        .filter(Boolean)
        .join(isRtl ? "، " : ", ");
    }

    return (
      selectedOption?.label || defaultValueOption?.label || placeholder
    );
  }, [
    displayTrim,
    multiple,
    selectedValues,
    options,
    isRtl,
    placeholder,
    selectedOption,
    defaultValueOption,
  ]);

  const filteredOptions = searchTerm
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : options;

  const isOptionSelected = (optionValue: string | number) => {
    if (multiple) {
      return selectedValues.some((selectedValue) =>
        valuesMatch(selectedValue, optionValue),
      );
    }
    return valuesMatch(value as string | number, optionValue);
  };

  const handleOptionClick = (optionValue: string | number) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? [...value] : [];
      const existingIndex = currentValues.findIndex((item) =>
        valuesMatch(item, optionValue),
      );

      const nextValues =
        existingIndex >= 0
          ? currentValues.filter((_, index) => index !== existingIndex)
          : [...currentValues, optionValue];

      (onChange as MultipleSearchableSelectProps["onChange"])(nextValues);
      return;
    }

    (onChange as SingleSearchableSelectProps["onChange"])(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const hasSelection = multiple
    ? selectedValues.length > 0
    : Boolean(displayTrim || selectedOption);

  return (
    <Box ref={dropdownRef} className={className} sx={{ position: "relative" }}>
      {label && (
        <FormLabel
          htmlFor={name}
          error={!!error}
          sx={{
            display: "block",
            mb: 1,
            color: error ? "error.main" : "text.primary",
          }}
        >
          {label}{" "}
          {required && (
            <span style={{ color: theme.palette.error.main }}>*</span>
          )}
        </FormLabel>
      )}

      <Box
        onClick={() => !disabled && setIsOpen(!isOpen)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          bgcolor: "background.paper",
          border: 1,
          borderColor: error ? "error.main" : "divider",
          borderRadius: 1,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.7 : 1,
          minHeight: 44,
          "&:hover": {
            borderColor: disabled ? "divider" : "primary.main",
          },
        }}
      >
        <Typography
          sx={{
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: multiple ? "normal" : "nowrap",
            display: "-webkit-box",
            WebkitLineClamp: multiple ? 2 : 1,
            WebkitBoxOrient: "vertical",
            color: hasSelection ? "text.primary" : "text.secondary",
          }}
        >
          {mainLabel}
        </Typography>
        <KeyboardArrowDownIcon
          sx={{
            color: "text.secondary",
            transition: "transform 0.2s",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
            ml: 1,
          }}
        />
      </Box>

      {isOpen && (
        <Paper
          elevation={8}
          sx={{
            position: "absolute",
            zIndex: 9999,
            width: "100%",
            mt: 0.5,
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            maxHeight: 240,
            overflow: "hidden",
          }}
        >
          {searchable && (
            <Box sx={{ p: 1.5, borderBottom: 1, borderColor: "divider" }}>
              <TextField
                fullWidth
                size="small"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{ color: "text.secondary", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.default",
                  },
                }}
              />
            </Box>
          )}

          <Box sx={{ maxHeight: searchable ? 180 : 240, overflowY: "auto" }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const selected = isOptionSelected(option.value);

                return (
                  <Box
                    key={`${String(option.value)}-${option.label}`}
                    onClick={() => handleOptionClick(option.value)}
                    sx={{
                      px: multiple ? 1 : 2,
                      py: 1.5,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      bgcolor: !multiple && selected
                        ? "primary.main"
                        : "transparent",
                      color: !multiple && selected
                        ? "primary.contrastText"
                        : "text.primary",
                      "&:hover": {
                        bgcolor: !multiple && selected
                          ? "primary.dark"
                          : "action.hover",
                      },
                    }}
                  >
                    {multiple && (
                      <Checkbox
                        checked={selected}
                        size="small"
                        sx={{ p: 0.5 }}
                        tabIndex={-1}
                      />
                    )}
                    <Typography variant="body2">{option.label}</Typography>
                  </Box>
                );
              })
            ) : (
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {noResultsText}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      )}

      {error && (
        <FormHelperText
          error
          sx={{ mt: 0.5, textAlign: isRtl ? "right" : "left" }}
        >
          {error}
        </FormHelperText>
      )}
    </Box>
  );
};

export default SearchableSelect;
