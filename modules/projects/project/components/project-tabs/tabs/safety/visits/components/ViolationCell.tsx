"use client";

import { Box } from "@mui/material";
import {
  isImageEvidence,
  type SafetyViolation,
} from "../types";
import { SAFETY_VIOLATION_EMPTY_VALUE } from "../constants/safetyViolations";

type ViolationCellProps = {
  value: string;
  violation: SafetyViolation | undefined;
  onOpenEvidence: (violation: SafetyViolation) => void;
};

export default function ViolationCell({
  value,
  violation,
  onOpenEvidence,
}: ViolationCellProps) {
  const isEmpty = value === SAFETY_VIOLATION_EMPTY_VALUE;
  const hasImageEvidence =
    (violation?.evidence.filter(isImageEvidence).length ?? 0) > 0;

  if (!hasImageEvidence || !violation) {
    return (
      <span
        style={{
          opacity: isEmpty ? 0.45 : 1,
          fontWeight: isEmpty ? 400 : 600,
        }}
      >
        {value}
      </span>
    );
  }

  return (
    <Box
      component="button"
      type="button"
      onClick={() => onOpenEvidence(violation)}
      sx={{
        opacity: isEmpty ? 0.45 : 1,
        fontWeight: isEmpty ? 400 : 600,
        cursor: "pointer",
        border: "none",
        background: "none",
        padding: 0,
        font: "inherit",
        color: "inherit",
        textDecoration: "underline",
        textUnderlineOffset: "2px",
        "&:hover": {
          opacity: 0.75,
        },
      }}
    >
      {value}
    </Box>
  );
}
