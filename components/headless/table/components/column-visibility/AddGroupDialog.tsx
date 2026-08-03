import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Tooltip,
} from "@mui/material";
import { useTranslations } from "next-intl";
import {
  DEFAULT_GROUP_BACKGROUND,
  DEFAULT_GROUP_TEXT_COLOR,
} from "../column-grouping";

export type AddGroupDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, backgroundColor: string, textColor: string) => void;
};

export function AddGroupDialog({ open, onClose, onCreate }: AddGroupDialogProps) {
  const t = useTranslations("Table");
  const [name, setName] = useState("");
  const [backgroundColor, setBackgroundColor] = useState(
    DEFAULT_GROUP_BACKGROUND,
  );
  const [textColor, setTextColor] = useState(DEFAULT_GROUP_TEXT_COLOR);

  useEffect(() => {
    if (open) {
      setName("");
      setBackgroundColor(DEFAULT_GROUP_BACKGROUND);
      setTextColor(DEFAULT_GROUP_TEXT_COLOR);
    }
  }, [open]);

  const trimmedName = name.trim();

  const handleCreate = () => {
    if (!trimmedName) return;
    onCreate(trimmedName, backgroundColor, textColor);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t("AddGroup")}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField
            autoFocus
            fullWidth
            required
            label={t("GroupName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Tooltip title={t("GroupBackgroundColor")}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  component="input"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) =>
                    setBackgroundColor((e.target as HTMLInputElement).value)
                  }
                  sx={{
                    width: 32,
                    height: 32,
                    p: 0,
                    border: "none",
                    borderRadius: 0.5,
                    cursor: "pointer",
                  }}
                />
                <Box component="span" sx={{ fontSize: 13, color: "text.secondary" }}>
                  {t("GroupBackgroundColor")}
                </Box>
              </Box>
            </Tooltip>
            <Tooltip title={t("GroupTextColor")}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  component="input"
                  type="color"
                  value={textColor}
                  onChange={(e) =>
                    setTextColor((e.target as HTMLInputElement).value)
                  }
                  sx={{
                    width: 32,
                    height: 32,
                    p: 0,
                    border: "none",
                    borderRadius: 0.5,
                    cursor: "pointer",
                  }}
                />
                <Box component="span" sx={{ fontSize: 13, color: "text.secondary" }}>
                  {t("GroupTextColor")}
                </Box>
              </Box>
            </Tooltip>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("Cancel")}</Button>
        <Button variant="contained" onClick={handleCreate} disabled={!trimmedName}>
          {t("Create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
