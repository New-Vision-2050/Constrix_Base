import React from "react";
import TextField from "@mui/material/TextField";
import { useTranslations } from "next-intl";
import { Box } from "@mui/material";

interface CoordinatesInputProps {
  longitude: string;
  latitude: string;
  radius: string;
  onLongitudeChange: (value: string) => void;
  onLatitudeChange: (value: string) => void;
  onRadiusChange: (value: string) => void;
  onRadiusBlur?: (value: string) => void;
  disabled?: boolean;
}

export default function CoordinatesInput({
  longitude,
  latitude,
  radius,
  onLongitudeChange,
  onLatitudeChange,
  onRadiusChange,
  onRadiusBlur,
  disabled = false,
}: CoordinatesInputProps) {
  const t = useTranslations("location");

  const radiusNumber = radius === "" ? NaN : Number(radius);
  const radiusError =
    radius !== "" && Number.isFinite(radiusNumber) && radiusNumber < 200;

  return (
    <Box className="grid grid-cols-2 gap-4 mb-6">
      <Box>
        <TextField
          fullWidth
          size="small"
          type="number"
          label={`${t("longitude")}`}
          value={longitude}
          onChange={(e) => onLongitudeChange(e.target.value)}
          placeholder="46.6753"
          disabled={disabled}
        />
      </Box>
      <Box>
        <TextField
          fullWidth
          size="small"
          type="number"
          label={`${t("latitude")}`}
          value={latitude}
          onChange={(e) => onLatitudeChange(e.target.value)}
          placeholder="24.7136"
          disabled={disabled}
        />
      </Box>
      <Box className="col-span-2">
        <TextField
          fullWidth
          size="small"
          type="number"
          label={`${t("radius")} (${t("meters")})`}
          value={radius}
          onChange={(e) => onRadiusChange(e.target.value)}
          onBlur={(e) => onRadiusBlur?.(e.target.value)}
          placeholder="1000"
          error={radiusError}
          helperText={radiusError ? `${t("radius")} >= 200` : ""}
          inputProps={{ min: 200 }}
        />
      </Box>
    </Box>
  );
}
