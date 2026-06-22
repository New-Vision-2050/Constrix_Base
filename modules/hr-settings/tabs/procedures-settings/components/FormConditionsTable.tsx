"use client";

import {
  AccessTimeOutlined,
  AssignmentOutlined,
  CheckCircleOutline,
  HowToRegOutlined,
  LocationOnOutlined,
  WorkOutline,
} from "@mui/icons-material";
import {
  Box,
  InputAdornment,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { alpha, useTheme, type Theme } from "@mui/material/styles";
import type { SvgIconComponent } from "@mui/icons-material";
import type {
  ConditionSettingSchemaOption,
  FormConditionOption,
} from "@/services/api/hr-settings/internal-procedure-settings/types/response";
import type { TaskActionConditionFormValue } from "../types";

interface FormConditionsTableProps {
  definitions: FormConditionOption[];
  conditions: TaskActionConditionFormValue[];
  onChange: (conditions: TaskActionConditionFormValue[]) => void;
  disabled?: boolean;
  labels: {
    sortOrder: string;
    status: string;
    condition: string;
    conditionType: string;
    settings: string;
  };
}

interface CategoryTheme {
  rowBg: string;
  badgeBg: string;
  badgeColor: string;
  icon: SvgIconComponent;
}

const ROW_LAYOUT_SX = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 1.5,
} as const;

const COL = {
  order: { width: 40, flexShrink: 0 },
  status: { width: 52, flexShrink: 0 },
  type: { minWidth: 88, flex: "0.55 1 88px" },
  condition: { minWidth: 120, flex: "0.75 1 120px" },
  settings: { minWidth: 220, flex: "1.4 1 220px" },
} as const;

function getSurfaceBg(theme: Theme) {
  if (theme.palette.mode === "dark") {
    return theme.palette.background.card ?? theme.palette.background.paper;
  }
  return theme.palette.background.default;
}

function getBorderColor(theme: Theme) {
  return alpha(
    theme.palette.text.primary,
    theme.palette.mode === "dark" ? 0.16 : 0.1,
  );
}

function buildCategoryTheme(
  theme: Theme,
  color: string,
  icon: SvgIconComponent,
): CategoryTheme {
  const isDark = theme.palette.mode === "dark";

  return {
    rowBg: alpha(color, isDark ? 0.16 : 0.1),
    badgeBg: alpha(color, isDark ? 0.3 : 0.2),
    badgeColor: color,
    icon,
  };
}

function buildCategoryThemes(theme: Theme): Record<string, CategoryTheme> {
  const { palette } = theme;
  const info = palette.info?.main ?? palette.secondary.main;
  const error = palette.error?.main ?? palette.primary.main;

  return {
    time: buildCategoryTheme(theme, palette.success.main, AccessTimeOutlined),
    location: buildCategoryTheme(theme, palette.primary.main, LocationOnOutlined),
    attendance: buildCategoryTheme(theme, info, HowToRegOutlined),
    task_status: buildCategoryTheme(theme, palette.secondary.main, CheckCircleOutline),
    open_task: buildCategoryTheme(theme, error, AssignmentOutlined),
    shift: buildCategoryTheme(theme, palette.warning.main, WorkOutline),
  };
}

function getCategoryTheme(
  themes: Record<string, CategoryTheme>,
  category: string,
  index: number,
): CategoryTheme {
  const fallback = Object.values(themes);
  return themes[category] ?? fallback[index % fallback.length];
}

function getCompactFieldSx(theme: Theme) {
  const border = getBorderColor(theme);

  return {
    "& .MuiOutlinedInput-root": {
      bgcolor: getSurfaceBg(theme),
      borderRadius: 1.5,
      fontSize: 13,
      "& fieldset": { borderColor: border },
      "&:hover fieldset": {
        borderColor: alpha(theme.palette.text.primary, 0.2),
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: 12,
      color: "text.secondary",
      right: 14,
      left: "auto",
      transformOrigin: "top right",
    },
    "& .MuiInputLabel-shrink": {
      transform: "translate(0, -9px) scale(0.75)",
    },
  };
}

function getSettingsPanelSx(theme: Theme) {
  return {
    bgcolor: getSurfaceBg(theme),
    borderRadius: 2,
    border: `1px solid ${getBorderColor(theme)}`,
  };
}

function updateConditionAtIndex(
  conditions: TaskActionConditionFormValue[],
  index: number,
  patch: Partial<TaskActionConditionFormValue>,
): TaskActionConditionFormValue[] {
  return conditions.map((condition, conditionIndex) =>
    conditionIndex === index ? { ...condition, ...patch } : condition,
  );
}

function updateConditionSetting(
  conditions: TaskActionConditionFormValue[],
  index: number,
  settingKey: string,
  value: string | number | boolean,
): TaskActionConditionFormValue[] {
  return conditions.map((condition, conditionIndex) => {
    if (conditionIndex !== index) return condition;
    return {
      ...condition,
      settings: {
        ...condition.settings,
        [settingKey]: value,
      },
    };
  });
}

function isSettingFieldVisible(
  field: ConditionSettingSchemaOption,
  settings: Record<string, string | number | boolean>,
): boolean {
  if (!field.visibleWhen) return true;
  return settings[field.visibleWhen.key] === field.visibleWhen.value;
}

function findPrimarySelectField(
  schema: ConditionSettingSchemaOption[],
): ConditionSettingSchemaOption | undefined {
  return schema.find((field) => field.type === "select");
}

function getSettingsPanelFields(
  schema: ConditionSettingSchemaOption[],
  settings: Record<string, string | number | boolean>,
): ConditionSettingSchemaOption[] {
  const primarySelect = findPrimarySelectField(schema);

  return schema.filter((field) => {
    if (primarySelect && field.key === primarySelect.key) return false;
    return isSettingFieldVisible(field, settings);
  });
}

function renderSettingField(
  field: ConditionSettingSchemaOption,
  value: string | number | boolean,
  fieldDisabled: boolean,
  compactFieldSx: ReturnType<typeof getCompactFieldSx>,
  onValueChange: (value: string | number | boolean) => void,
) {
  if (field.type === "int") {
    const isMinuteField =
      field.key.includes("minute") || field.label.includes("دقيقة");

    if (isMinuteField) {
      return (
        <TextField
          key={field.key}
          select
          label={field.label}
          size="small"
          value={String(value)}
          onChange={(event) => {
            const parsed = parseInt(event.target.value, 10);
            onValueChange(Number.isNaN(parsed) ? 0 : parsed);
          }}
          disabled={fieldDisabled}
          sx={compactFieldSx}
        >
          {[0, 5, 10, 15, 30, 45, 60].map((minute) => (
            <MenuItem key={minute} value={String(minute)}>
              {minute}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    return (
      <TextField
        key={field.key}
        label={field.label}
        type="number"
        size="small"
        value={value ?? field.default ?? 0}
        onChange={(event) => {
          const parsed = parseInt(event.target.value, 10);
          onValueChange(Number.isNaN(parsed) ? 0 : parsed);
        }}
        disabled={fieldDisabled}
        inputProps={{ min: 0, step: 1 }}
        sx={compactFieldSx}
      />
    );
  }

  if (field.type === "bool") {
    return (
      <Box
        key={field.key}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          px: 0.5,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {field.label}
        </Typography>
        <Switch
          checked={Boolean(value)}
          onChange={(event) => onValueChange(event.target.checked)}
          disabled={fieldDisabled}
          size="small"
          color="success"
        />
      </Box>
    );
  }

  if (field.type === "select") {
    return (
      <TextField
        key={field.key}
        select
        label={field.label}
        size="small"
        value={String(value ?? field.default ?? field.options?.[0]?.value ?? "")}
        onChange={(event) => onValueChange(event.target.value)}
        disabled={fieldDisabled}
        sx={compactFieldSx}
      >
        {(field.options ?? []).map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  if (field.type === "time") {
    return (
      <TextField
        key={field.key}
        label={field.label}
        type="time"
        size="small"
        value={String(value ?? field.default ?? "08:00")}
        onChange={(event) => onValueChange(event.target.value)}
        disabled={fieldDisabled}
        sx={compactFieldSx}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <AccessTimeOutlined sx={{ fontSize: 18, color: "text.secondary" }} />
            </InputAdornment>
          ),
        }}
        inputProps={{ step: 60 }}
      />
    );
  }

  return (
    <TextField
      key={field.key}
      label={field.label}
      size="small"
      value={String(value)}
      onChange={(event) => onValueChange(event.target.value)}
      disabled={fieldDisabled}
      sx={compactFieldSx}
    />
  );
}

function SettingsPanel({
  definition,
  condition,
  conditionIndex,
  conditions,
  onChange,
  disabled,
}: {
  definition: FormConditionOption;
  condition: TaskActionConditionFormValue;
  conditionIndex: number;
  conditions: TaskActionConditionFormValue[];
  onChange: (conditions: TaskActionConditionFormValue[]) => void;
  disabled: boolean;
}) {
  const theme = useTheme();
  const fieldDisabled = disabled || !condition.isActive;
  const panelSx = getSettingsPanelSx(theme);
  const compactFieldSx = getCompactFieldSx(theme);
  const panelFields = getSettingsPanelFields(
    definition.settingsSchema,
    condition.settings,
  );

  if (panelFields.length === 0) {
    return (
      <Box
        sx={{
          ...panelSx,
          minHeight: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Typography variant="body2" color="text.disabled">
          —
        </Typography>
      </Box>
    );
  }

  const timeFields = panelFields.filter((field) => field.type === "time");
  const otherFields = panelFields.filter((field) => field.type !== "time");

  const handleSettingChange = (settingKey: string, value: string | number | boolean) => {
    onChange(
      updateConditionSetting(conditions, conditionIndex, settingKey, value),
    );
  };

  return (
    <Box
      sx={{
        ...panelSx,
        p: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
      }}
    >
      {timeFields.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: `repeat(${Math.min(timeFields.length, 2)}, minmax(0, 1fr))`,
            },
            gap: 1,
          }}
        >
          {timeFields.map((field) =>
            renderSettingField(
              field,
              condition.settings[field.key] ?? field.default ?? "08:00",
              fieldDisabled,
              compactFieldSx,
              (value) => handleSettingChange(field.key, value),
            ),
          )}
        </Box>
      )}

      {otherFields.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: `repeat(${Math.min(otherFields.length, 2)}, minmax(0, 1fr))`,
            },
            gap: 1,
          }}
        >
          {otherFields.map((field) =>
            renderSettingField(
              field,
              condition.settings[field.key] ?? field.default ?? "",
              fieldDisabled,
              compactFieldSx,
              (value) => handleSettingChange(field.key, value),
            ),
          )}
        </Box>
      )}
    </Box>
  );
}

export default function FormConditionsTable({
  definitions,
  conditions,
  onChange,
  disabled = false,
  labels,
}: FormConditionsTableProps) {
  const theme = useTheme();
  const categoryThemes = buildCategoryThemes(theme);
  const surfaceBg = getSurfaceBg(theme);
  const borderColor = getBorderColor(theme);

  const definitionByKey = new Map(
    definitions.map((definition) => [definition.key, definition]),
  );

  const sortedConditions = [...conditions].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
      <Box sx={{ ...ROW_LAYOUT_SX, px: 1.5 }}>
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ ...COL.order, textAlign: "center" }}
        >
          {labels.sortOrder}
        </Typography>
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ ...COL.status, textAlign: "center" }}
        >
          {labels.status}
        </Typography>
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ ...COL.type, textAlign: "center" }}
        >
          {labels.conditionType}
        </Typography>
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ ...COL.condition, textAlign: "center" }}
        >
          {labels.condition}
        </Typography>
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ ...COL.settings, textAlign: "center" }}
        >
          {labels.settings}
        </Typography>
      </Box>

      {sortedConditions.map((condition, rowIndex) => {
        const definition = definitionByKey.get(condition.key);
        const conditionIndex = conditions.findIndex(
          (item) => item.key === condition.key,
        );

        if (!definition || conditionIndex < 0) return null;

        const categoryTheme = getCategoryTheme(
          categoryThemes,
          definition.category,
          rowIndex,
        );
        const CategoryIcon = categoryTheme.icon;
        const primarySelectField = findPrimarySelectField(definition.settingsSchema);
        const compactFieldSx = getCompactFieldSx(theme);

        return (
          <Box
            key={condition.key}
            sx={{
              ...ROW_LAYOUT_SX,
              bgcolor: categoryTheme.rowBg,
              borderRadius: 2.5,
              px: 1.5,
              py: 1.25,
              minHeight: 72,
            }}
          >
            <Box
              sx={{
                ...COL.order,
                height: 40,
                bgcolor: surfaceBg,
                borderRadius: 1.5,
                border: `1px solid ${borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" fontWeight={700} color="text.primary">
                {rowIndex + 1}
              </Typography>
            </Box>

            <Box sx={{ ...COL.status, display: "flex", justifyContent: "center" }}>
              <Switch
                checked={condition.isActive}
                onChange={(event) =>
                  onChange(
                    updateConditionAtIndex(conditions, conditionIndex, {
                      isActive: event.target.checked,
                    }),
                  )
                }
                disabled={disabled}
                color="success"
              />
            </Box>

            <Box
              sx={{
                ...COL.type,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.75,
                bgcolor: categoryTheme.badgeBg,
                color: categoryTheme.badgeColor,
                borderRadius: 999,
                px: 1.25,
                py: 0.75,
                minWidth: 0,
              }}
            >
              <CategoryIcon sx={{ fontSize: 16, flexShrink: 0 }} />
              <Typography
                variant="caption"
                fontWeight={700}
                noWrap
                sx={{ lineHeight: 1.2 }}
              >
                {definition.categoryLabel}
              </Typography>
            </Box>

            <Box sx={{ ...COL.condition, minWidth: 0 }}>
              {primarySelectField ? (
                <TextField
                  select
                  size="small"
                  fullWidth
                  value={String(
                    condition.settings[primarySelectField.key] ??
                      primarySelectField.default ??
                      primarySelectField.options?.[0]?.value ??
                      "",
                  )}
                  onChange={(event) =>
                    onChange(
                      updateConditionSetting(
                        conditions,
                        conditionIndex,
                        primarySelectField.key,
                        event.target.value,
                      ),
                    )
                  }
                  disabled={disabled || !condition.isActive}
                  sx={compactFieldSx}
                  label={definition.name}
                >
                  {(primarySelectField.options ?? []).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.primary"
                  sx={{ textAlign: "right" }}
                >
                  {definition.name}
                </Typography>
              )}
            </Box>

            <Box sx={COL.settings}>
              <SettingsPanel
                definition={definition}
                condition={condition}
                conditionIndex={conditionIndex}
                conditions={conditions}
                onChange={onChange}
                disabled={disabled}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
