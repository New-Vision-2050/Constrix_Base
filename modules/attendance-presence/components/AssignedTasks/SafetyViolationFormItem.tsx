"use client";

import {
  Box,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Camera, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ProjectViolationCatalogItemDto } from "@/services/api/projects/violations/types/response";
import {
  MAX_VIOLATION_PHOTOS,
  formatViolationActionsDisplay,
  type SafetyViolationAnswer,
  type SafetyViolationAnswerStatus,
  type ViolationActionOption,
} from "./safetyViolationFormUtils";

type SafetyViolationFormItemProps = {
  index: number;
  violation: ProjectViolationCatalogItemDto;
  answer: SafetyViolationAnswer;
  actionOptions: ViolationActionOption[];
  isActive: boolean;
  isLocked: boolean;
  disabled: boolean;
  onStatusChange: (status: SafetyViolationAnswerStatus) => void;
  onAddPhotos: (files: File[]) => void;
  onRemovePhoto: (photoIndex: number) => void;
};

const STATUS_OPTIONS: Array<{
  value: SafetyViolationAnswerStatus;
  messageKey:
    | "hasViolation"
    | "noViolation"
    | "notApplicable";
  borderColor: string;
}> = [
  {
    value: "violation_found",
    messageKey: "hasViolation",
    borderColor: "error.main",
  },
  {
    value: "no_violation",
    messageKey: "noViolation",
    borderColor: "success.main",
  },
  {
    value: "not_applicable",
    messageKey: "notApplicable",
    borderColor: "divider",
  },
];

export default function SafetyViolationFormItem({
  index,
  violation,
  answer,
  actionOptions,
  isActive,
  isLocked,
  disabled,
  onStatusChange,
  onAddPhotos,
  onRemovePhoto,
}: SafetyViolationFormItemProps) {
  const t = useTranslations("AttendancePresence");

  const showActionField = answer.status === "violation_found";
  const showPhotos = answer.status === "violation_found";
  const actionDisplay = formatViolationActionsDisplay(actionOptions);
  const canAddPhotos = answer.photos.length < MAX_VIOLATION_PHOTOS;

  const handlePhotoInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!selected.length) return;

    const remaining = MAX_VIOLATION_PHOTOS - answer.photos.length;
    onAddPhotos(selected.slice(0, remaining));
  };

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: isActive ? "primary.main" : "divider",
        borderRadius: 3,
        bgcolor: isLocked ? "action.hover" : "background.paper",
        p: 2,
        opacity: isLocked ? 0.72 : 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1.5,
          mb: 1.5,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700, flex: 1 }}>
          {index + 1}. {violation.description?.trim() || "—"}
        </Typography>
        {violation.category ? (
          <Box
            sx={{
              minWidth: 28,
              height: 28,
              borderRadius: 1,
              bgcolor: "action.selected",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            {violation.category}
          </Box>
        ) : null}
      </Box>

      {isLocked ? (
        <Typography variant="caption" color="text.secondary">
          {t("assignedTasks.safetyViolationForm.completePreviousItem")}
        </Typography>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              gap: 0.75,
              mb: showActionField || showPhotos ? 1.5 : 0,
            }}
          >
            {STATUS_OPTIONS.map((option) => {
              const isSelected = answer.status === option.value;

              return (
                <Box
                  key={option.value}
                  component="button"
                  type="button"
                  disabled={disabled}
                  onClick={() => onStatusChange(option.value)}
                  sx={{
                    flex: 1,
                    border: "1px solid",
                    borderColor: isSelected ? option.borderColor : "divider",
                    borderRadius: "999px",
                    bgcolor: isSelected ? "action.selected" : "background.paper",
                    color: isSelected ? "text.primary" : "text.secondary",
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.6 : 1,
                    px: 1,
                    py: 1,
                    fontSize: 12,
                    fontWeight: 700,
                    lineHeight: 1.3,
                    fontFamily: "inherit",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  {t(`assignedTasks.safetyViolationForm.${option.messageKey}`)}
                </Box>
              );
            })}
          </Box>

          {showActionField ? (
            <TextField
              label={t("assignedTasks.safetyViolationForm.actionLabel")}
              value={actionDisplay}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
              sx={{
                mb: 1.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  bgcolor: "action.hover",
                },
                "& .MuiInputBase-input": {
                  cursor: "default",
                },
              }}
            />
          ) : null}

          {showPhotos ? (
            <Box>
              <Typography
                variant="caption"
                sx={{ color: "error.main", fontWeight: 700, display: "block", mb: 0.5 }}
              >
                {t("assignedTasks.safetyViolationForm.photosRequired", {
                  max: MAX_VIOLATION_PHOTOS,
                })}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                {t("assignedTasks.safetyViolationForm.photosRequiredHint")}
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25 }}>
                {answer.photos.map((photo, photoIndex) => (
                  <Box
                    key={`${photo.file.name}-${photoIndex}`}
                    sx={{
                      position: "relative",
                      width: 72,
                      height: 72,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={photo.file.name}
                      className="h-full w-full object-cover"
                    />
                    <IconButton
                      size="small"
                      onClick={() => onRemovePhoto(photoIndex)}
                      disabled={disabled}
                      sx={{
                        position: "absolute",
                        top: 2,
                        insetInlineEnd: 2,
                        bgcolor: "rgba(0,0,0,0.55)",
                        color: "common.white",
                        width: 20,
                        height: 20,
                      }}
                    >
                      <X size={10} />
                    </IconButton>
                  </Box>
                ))}

                {canAddPhotos ? (
                  <Box
                    component="label"
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: 2,
                      border: "1px dashed",
                      borderColor: "primary.main",
                      bgcolor: "action.hover",
                      color: "primary.main",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.25,
                      cursor: disabled ? "not-allowed" : "pointer",
                      opacity: disabled ? 0.6 : 1,
                    }}
                  >
                    <Camera size={18} />
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {t("assignedTasks.safetyViolationForm.addPhotos")}
                    </Typography>
                    <input
                      type="file"
                      multiple
                      hidden
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handlePhotoInput}
                      disabled={disabled}
                    />
                  </Box>
                ) : null}
              </Box>
            </Box>
          ) : null}
        </>
      )}
    </Box>
  );
}
