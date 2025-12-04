import { Box } from "@mui/material";

interface ThemeImageSectionProps {
  imageUrl: string;
  alt: string;
}

/**
 * Theme main image section
 * - Responsive image with overlay
 * - RTL/LTR support
 */
export default function ThemeImageSection({ imageUrl, alt }: ThemeImageSectionProps) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 300, md: 400 },
        borderRadius: 2,
        overflow: "hidden",
        mb: 4,
      }}
    >
      <Box
        component="img"
        src={imageUrl}
        alt={alt}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </Box>
  );
}

