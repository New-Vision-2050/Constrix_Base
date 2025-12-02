import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

interface LoadingProps {
    message?: string;
    size?: number;
}

/**
 * Loading component with RTL/LTR and Light/Dark mode support
 * Uses MUI's CircularProgress which automatically supports theme modes
 */
export default function Loading({ message, size = 40 }: LoadingProps) {
    const t = useTranslations("common");

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            minHeight="400px"
            gap={2}
            py={4}
        >
            <CircularProgress size={size} />
            <Typography variant="body1" color="text.secondary">
                {message || t("loading")}
            </Typography>
        </Stack>
    );
}

