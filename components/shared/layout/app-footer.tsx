import { FooterWave } from "@/components/icons/footer-wave";
import NewVisionWhite from "@/public/icons/new-vision-white";
import { Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

function AppFooter() {
  const { palette } = useTheme();
  const t = useTranslations("Header");
  const color =
    palette.mode === "dark"
      ? palette.background.paper
      : palette.background.paper;
  return (
    <div className="py-8 relative mt-6">
      <div className="flex px-16 items-center justify-end gap-2">
        <Typography variant="subtitle2">{t("footerMessage")}</Typography>
        <NewVisionWhite color={palette.text.primary} />
      </div>
      <FooterWave
        color={color}
        className="absolute bottom-0 -z-10 "
        width="100%"
      />
    </div>
  );
}

export default AppFooter;
