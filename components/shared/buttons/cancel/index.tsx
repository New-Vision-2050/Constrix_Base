import { Button, ButtonProps } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";

function CancelButton({ children, ...props }: ButtonProps) {
  const t = useTranslations("common");
  return (
    <Button variant="text" color="error" startIcon={<CloseIcon />} {...props}>
      {children ?? t("cancel")}
    </Button>
  );
}

export default CancelButton;
