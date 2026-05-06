import React, { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import {
  Box,
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

interface SearchableSelectProps {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
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
}

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
}) => {
  const theme = useTheme();
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const defaultValueOption = defaultValue
    ? options.find((opt) => opt.value === defaultValue)
    : undefined;

  const filteredOptions = searchTerm
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : options;

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

      {/* Selected value display / trigger */}
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
            whiteSpace: "nowrap",
            color: selectedOption ? "text.primary" : "text.secondary",
          }}
        >
          {selectedOption
            ? selectedOption.label
            : defaultValueOption?.label || placeholder}
        </Typography>
        <KeyboardArrowDownIcon
          sx={{
            color: "text.secondary",
            transition: "transform 0.2s",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </Box>

      {/* Dropdown */}
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
          {/* Search input */}
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

          {/* Options */}
          <Box sx={{ maxHeight: 180, overflowY: "auto" }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <Box
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  sx={{
                    px: 2,
                    py: 1.5,
                    cursor: "pointer",
                    bgcolor:
                      option.value === value ? "primary.main" : "transparent",
                    color:
                      option.value === value
                        ? "primary.contrastText"
                        : "text.primary",
                    "&:hover": {
                      bgcolor:
                        option.value === value
                          ? "primary.dark"
                          : "action.hover",
                    },
                  }}
                >
                  <Typography variant="body2">{option.label}</Typography>
                </Box>
              ))
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

      {/* Error message */}
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
