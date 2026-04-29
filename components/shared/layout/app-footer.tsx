import NewVisionWhite from "@/public/icons/new-vision-white";
import { Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

function AppFooter() {
  const { palette } = useTheme();
  const t = useTranslations("Header");
  return (
    <div className="flex items-center justify-end p-8 px-16 gap-2">
      <Typography variant="subtitle2">{t("footerMessage")}</Typography>
      <NewVisionWhite color={palette.text.primary} />
    </div>
  );
}

export default AppFooter;
