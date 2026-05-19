"use client";
import { Box, Typography } from "@mui/material";
import { Check } from "lucide-react";

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
        py: 8,
        px: { xs: 4, md: 12 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <Box
              key={step.number}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                flex: 1,
                zIndex: 2,
              }}
            >
              {/* Step Circle */}
              <Box
                sx={{
                  width: { xs: 40, md: 48 },
                  height: { xs: 40, md: 48 },
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isCompleted || isActive
                    ? "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)"
                    : "rgba(100, 116, 139, 0.6)",
                  border: isActive
                    ? "3px solid rgba(236, 72, 153, 0.8)"
                    : "2px solid rgba(100, 116, 139, 0.6)",
                  boxShadow: isCompleted || isActive
                    ? "0 0 30px rgba(236, 72, 153, 0.7), 0 0 60px rgba(236, 72, 153, 0.4)"
                    : "0 0 15px rgba(100, 116, 139, 0.3)",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  "&::before": isActive
                    ? {
                        content: '""',
                        position: "absolute",
                        inset: -8,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
                        opacity: 0.3,
                      }
                    : {},
                }}
              >
                {isCompleted ? (
                  <Check size={24} color="white" strokeWidth={3} />
                ) : (
                  <Typography
                    sx={{
                      fontSize: { xs: 20, md: 24 },
                      fontWeight: 800,
                      color: isActive ? "white" : "rgba(148, 163, 184, 0.9)",
                    }}
                  >
                    {step.number}
                  </Typography>
                )}
              </Box>

              {/* Step Label */}
              <Typography
                sx={{
                  mt: 4,
                  fontSize: { xs: 10, md: 12 },
                  fontWeight: isActive ? 800 : 600,
                  color: isCompleted || isActive
                    ? "rgba(236, 72, 153, 1)"
                    : "rgba(148, 163, 184, 0.8)",
                  textAlign: "center",
                  transition: "all 0.4s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {step.label}
              </Typography>

              {/* Connecting Line */}
              {!isLast && (
                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: 20, md: 24 },
                    left: "calc(50% + 25px)",
                    right: "calc(-50% + 25px)",
                    height: 8,
                    zIndex: 1,
                    overflow: "hidden",
                    background: "rgba(100, 116, 139, 0)",
                    borderRadius: 4,
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: isCompleted ? "100%" : "0%",
                      background: "linear-gradient(90deg, #ec4899 0%, #f472b6 100%)",
                      boxShadow: "0 0 20px rgba(236, 72, 153, 0)",
                      transition: "width 0.6s ease-in-out",
                    }}
                  />
                </Box>
              )}

              {/* Final Line with Dot for Last Step */}
              {isLast && (
                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: 20, md: 24 },
                    left: "calc(50% + 25px)",
                    right: -25,
                    height: 8,
                    zIndex: 1,
                    overflow: "hidden",
                    background: "rgba(100, 116, 139, 0)",
                    borderRadius: 4,
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: isCompleted ? "100%" : "0%",
                      background: "linear-gradient(90deg, #ec4899 0%, #f472b6 100%)",
                      boxShadow: "0 0 20px rgba(236, 72, 153, 0)",
                      transition: "width 0.6s ease-in-out",
                    }}
                  />
                  {/* Dot at the end */}
                  <Box
                    sx={{
                      position: "absolute",
                      right: -6,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: isCompleted
                        ? "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)"
                        : "rgba(100, 116, 139, 0.7)",
                      border: "2px solid rgba(100, 116, 139, 0.6)",
                    }}
                  />
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
