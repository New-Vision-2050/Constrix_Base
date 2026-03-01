import { Button, ButtonProps } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useTranslations } from "next-intl";

function SaveButton({ children, ...props }: ButtonProps) {
  const t = useTranslations("common");
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<SaveIcon />}
      {...props}
    >
      {children ?? t("save")}
    </Button>
  );
}

export default SaveButton;
