"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { APP_ICONS } from "@/constants/icons";
import { PRJ_ProjectType } from "@/types/api/projects/project-type";

interface EditStageDialogProps {
  open: boolean;
  onClose: () => void;
  stage: PRJ_ProjectType | null;
  parentId: number;
  onSuccess: () => void;
}

export default function EditStageDialog({
  open,
  onClose,
  stage,
  parentId,
  onSuccess,
}: EditStageDialogProps) {
  const t = useTranslations("CRMSettingsModule.proceduresSettings.stages");

  const [name, setName] = useState("");
  const [executionType, setExecutionType] = useState("sequential");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [durationPercentage, setDurationPercentage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (stage) {
      setName(stage.name || "");
      setSelectedIcon(stage.icon || null);
    }
  }, [stage]);

  const handleSubmit = async () => {
    if (!name.trim() || !stage) return;

    setIsSubmitting(true);
    try {
      // TODO: Implement API call to update stage
      console.log("Updating stage:", {
        id: stage.id,
        name,
        executionType,
        selectedIcon,
        durationPercentage,
        parentId,
      });
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error updating stage:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setExecutionType("sequential");
    setSelectedIcon(null);
    setDurationPercentage("");
    onClose();
  };

  const handleDelete = async () => {
    if (!stage) return;
    // TODO: Implement delete functionality
    console.log("Deleting stage:", stage.id);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("editStage")}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
          <TextField
            label={t("stageName")}
            placeholder={t("enterStageName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="small"
          />

          <FormControl>
            <FormLabel>{t("executeProjectStages")}</FormLabel>
            <RadioGroup
              row
              value={executionType}
              onChange={(e) => setExecutionType(e.target.value)}
            >
              <FormControlLabel
                value="sequential"
                control={<Radio />}
                label={t("sequential")}
              />
              <FormControlLabel
                value="parallel"
                control={<Radio />}
                label={t("parallel")}
              />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel>{t("selectIcon")}</FormLabel>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              {APP_ICONS.slice(0, 8).map((icon) => {
                const IconComponent = icon.component;
                return (
                  <IconButton
                    key={icon.id}
                    onClick={() => setSelectedIcon(icon.id)}
                    sx={{
                      border:
                        selectedIcon === icon.id
                          ? "2px solid"
                          : "1px solid transparent",
                      borderColor:
                        selectedIcon === icon.id ? "primary.main" : "divider",
                      borderRadius: 1,
                    }}
                  >
                    <IconComponent size={20} />
                  </IconButton>
                );
              })}
            </Box>
          </FormControl>

          <TextField
            label={t("stageDurationPercentage")}
            value={durationPercentage}
            onChange={(e) => setDurationPercentage(e.target.value)}
            fullWidth
            size="small"
            type="number"
            inputProps={{ min: 0, max: 100 }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button onClick={handleDelete} color="error" disabled={isSubmitting}>
          {t("delete")}
        </Button>
        <Box>
          <Button onClick={handleClose} disabled={isSubmitting} sx={{ mr: 1 }}>
            {t("save")}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting || !name.trim()}
          >
            {t("save")}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
