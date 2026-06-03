"use client";
import { Box, Typography } from "@mui/material";

interface Step {
  label: string;
  number: number;
}

interface PremiumStepperProps {
  steps: Step[];
  currentStep: number;
}

export default function PremiumStepper({ steps, currentStep }: PremiumStepperProps) {
  if (!steps || !Array.isArray(steps) || steps.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        width: "100%",
        py: 2,
        px: 2,
        direction: "ltr",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isLast = index === steps.length - 1;
          const isHighlighted = isCompleted || isActive;

          return (
            <Box
              key={step.number}
              sx={{
                display: "flex",
                alignItems: "center",
                flex: isLast ? "0 0 auto" : 1,
              }}
            >
              {/* Circle + Label */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexShrink: 0 }}>
                <Box
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isHighlighted ? "#ec4899" : "rgba(100, 116, 139, 0.5)",
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: isHighlighted ? "#fff" : "rgba(148, 163, 184, 0.9)",
                      lineHeight: 1,
                    }}
                  >
                    {step.number}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive
                      ? "#ec4899"
                      : isCompleted
                      ? "rgba(236, 72, 153, 0.7)"
                      : "rgba(148, 163, 184, 0.8)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.label}
                </Typography>
              </Box>

              {/* Connector Line */}
              {!isLast && (
                <Box
                  sx={{
                    flex: 1,
                    height: "1px",
                    mx: 1.5,
                    backgroundColor: isCompleted
                      ? "#ec4899"
                      : "rgba(100, 116, 139, 0.4)",
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
