"use client";

import { ThemeData } from "../types";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

interface ThemesGridProps {
  themes: ThemeData[];
  onThemeClick: (id: string) => void;
}

/**
 * Grid layout for displaying theme cards
 * - Responsive grid (1-3 columns based on screen size)
 * - RTL/LTR support
 */
export default function ThemesGrid({ themes, onThemeClick }: ThemesGridProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        },
        gap: 2,
      }}
    >
      {themes.map((theme) => (
        <ThemeCard
          key={theme.id}
          id={theme.id}
          src={theme.main_image}
          title={theme.title}
          description={theme.description}
          onClick={() => onThemeClick(theme.id)}
        />
      ))}
    </Box>
  );
}

interface ThemeCardProps {
  id: string;
  src: string;
  title: string;
  description: string;
  onClick: () => void;
}

/**
 * Theme card component using MUI Card
 * - Supports RTL/LTR automatically
 * - Light/Dark mode via MUI theme
 */
function ThemeCard({ src, title, description, onClick }: ThemeCardProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        minHeight: 320,
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardMedia component="img" height="192" image={src} alt={title} />
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="h6" component="h3" sx={{ wordBreak: "break-word" }}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            wordBreak: "break-word",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

