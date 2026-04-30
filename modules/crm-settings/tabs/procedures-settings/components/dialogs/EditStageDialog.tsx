"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormLabel,
  Box,
  Switch,
  Typography,
  FormHelperText,
  InputAdornment,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import IconPicker from "@/components/shared/icon-picker";
import { APP_ICONS } from "@/constants/icons";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/config/axios-config";
import { ProcedureSettingsApi } from "@/services/api/crm-settings/procedure-settings";
import { Stage } from "@/services/api/crm-settings/procedure-settings/types/response";
import { useToast } from "@/modules/table/hooks/use-toast";
import SearchableSelect from "@/components/shared/SearchableSelect";

const PROCEDURE_DIALOG_ICON_IDS = [
  "person-outline",
  "account-circle",
  "settings",
  "home",
  "alternate-email",
  "notifications",
  "inventory",
] as const;

const PROCEDURE_DIALOG_ICONS = APP_ICONS.filter((icon) =>
  PROCEDURE_DIALOG_ICON_IDS.includes(
    icon.id as (typeof PROCEDURE_DIALOG_ICON_IDS)[number],
  ),
);

interface EmployeeOption {
  id: string;
  name: string;
  email: string;
}

interface EditStageDialogProps {
  open: boolean;
  onClose: () => void;
  procedure: Stage | null;
  onSuccess: () => void;
  /** Called after the procedure is deleted (before onSuccess). */
  onDeleted?: (procedureId: string) => void;
}

export default function EditStageDialog({
  open,
  onClose,
  procedure,
  onSuccess,
  onDeleted,
}: EditStageDialogProps) {
  const t = useTranslations("CRMSettingsModule.proceduresSettings.stages");
  const tRoot = useTranslations("CRMSettingsModule.proceduresSettings");
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [sequentialApproval, setSequentialApproval] = useState(true);
  const [parallelApproval, setParallelApproval] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [durationPercentage, setDurationPercentage] = useState("");
  const [deadlineHours, setDeadlineHours] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("");
  const [escalationUserId, setEscalationUserId] = useState("");

  const { data: employees = [] } = useQuery<EmployeeOption[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await apiClient.get("/company-users/employees");
      const payload = response.data?.payload ?? response.data;
      return Array.isArray(payload) ? payload : [];
    },
  });
  const [errors, setErrors] = useState<{
    name: string;
    percentage: string;
    timeLimit: string;
  }>({ name: "", percentage: "", timeLimit: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !procedure) return;
    setName(procedure.name || "");
    const isParallel = procedure.execute_type === "parallel";
    setSequentialApproval(!isParallel);
    setParallelApproval(isParallel);
    setSelectedIcon(procedure.icon || null);
    setDurationPercentage(
      procedure.percentage != null ? String(procedure.percentage) : "",
    );
    setDeadlineHours(
      procedure.deadline_hours != null ? String(procedure.deadline_hours) : "",
    );
    setDeadlineDays(
      procedure.deadline_days != null ? String(procedure.deadline_days) : "",
    );
    setEscalationUserId(procedure.escalation_user_id || "");
    setErrors({ name: "", percentage: "", timeLimit: "" });
  }, [open, procedure]);

  const clearError = (field: keyof typeof errors) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  const handleSubmit = async () => {
    if (!procedure) return;

    const percentageValue = parseInt(durationPercentage, 10) || 0;
    const newErrors = {
      name: !name.trim() ? "هذا الحقل مطلوب" : "",
      percentage:
        durationPercentage !== "" && percentageValue > 100
          ? t("percentageMax")
          : "",
      timeLimit:
        !deadlineHours && !deadlineDays ? "يجب إدخال ساعات أو أيام" : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setIsSubmitting(true);
    try {
      await ProcedureSettingsApi.updateStage(procedure.id, {
        name: name.trim(),
        execute_type: sequentialApproval ? "sequence" : "parallel",
        icon: selectedIcon || procedure.icon,
        percentage: percentageValue,
        type: procedure.type,
        deadline_days: parseInt(deadlineDays) || 0,
        deadline_hours: parseInt(deadlineHours) || 0,
        escalation_user_id: escalationUserId,
      });
      toast({
        title: tRoot("actions.edit"),
        description: tRoot("messages.procedureUpdated"),
        variant: "default",
      });
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error updating procedure:", error);
      toast({
        title: tRoot("actions.edit"),
        description: tRoot("messages.error"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setSequentialApproval(true);
    setParallelApproval(false);
    setSelectedIcon(null);
    setDurationPercentage("");
    setDeadlineHours("");
    setDeadlineDays("");
    setEscalationUserId("");
    setErrors({ name: "", percentage: "", timeLimit: "" });
    onClose();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = async () => {
    if (!procedure) return;
    setIsSubmitting(true);
    try {
      await ProcedureSettingsApi.deleteStage(procedure.id);
      onDeleted?.(procedure.id);
      toast({
        title: tRoot("actions.delete"),
        description: tRoot("messages.procedureDeleted"),
        variant: "default",
      });
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error deleting procedure:", error);
      toast({
        title: tRoot("actions.delete"),
        description: tRoot("messages.error"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tab type from procedure
  const currentTabType = procedure?.type || "client_request";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: "start", pb: 1 }}>
        {currentTabType === "contract" && "تعديل إجراءات العقود"}
        {currentTabType === "meeting" && "تعديل إجراءات الاجتماعات"}
        {currentTabType === "price" && "تعديل إجراءات الأسعار"}
        {currentTabType === "employees" && "تعديل إجراءات الموظفين"}
        {currentTabType === "client_request" && "تعديل إجراءات طلبات العملاء"}
        {!["contract", "meeting", "price", "employees", "client_request"].includes(currentTabType) && t("editStage")}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", gap: 3, pt: 1 }}>
          {/* \u2500\u2500 Toggle cards column \u2500\u2500 */}
          <Box
            sx={{
              width: 270,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Sequential approval card */}
            <Box
              sx={{
                border: 1,
                borderColor: sequentialApproval ? "secondary.main" : "divider",
                borderRadius: 2,
                p: 2,
                textAlign: "end",
                bgcolor: "action.hover",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                <Switch
                  checked={sequentialApproval}
                  onChange={() => {
                    setSequentialApproval(true);
                    setParallelApproval(false);
                  }}
                  color="secondary"
                />
              </Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                الاعتماد التسلسلي
              </Typography>
              <Typography variant="caption" color="text.secondary">
                الاعتماد التسلسلي خلال الاعتماد التسلسلي للموافقة
              </Typography>
            </Box>

            {/* Parallel approval card */}
            <Box
              sx={{
                border: 1,
                borderColor: parallelApproval ? "primary.main" : "divider",
                borderRadius: 2,
                p: 2,
                textAlign: "end",
                bgcolor: "action.hover",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                <Switch
                  checked={parallelApproval}
                  onChange={() => {
                    setParallelApproval(true);
                    setSequentialApproval(false);
                  }}
                  color="primary"
                />
              </Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                الاعتماد المتوازي
              </Typography>
              <Typography variant="caption" color="text.secondary">
                الاعتماد المتوازي خلال الاعتماد المتوازي للموافقة
              </Typography>
            </Box>
          </Box>

          {/* \u2500\u2500 Form fields column \u2500\u2500 */}
          <Box
            sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            {/* Stage name */}
            <TextField
              placeholder={t("stageName")}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError("name");
              }}
              fullWidth
              size="small"
              error={!!errors.name}
              helperText={errors.name}
            />

            {/* Icon picker */}
            <Box>
              <FormLabel sx={{ display: "block", mb: 1 }}>
                {t("selectIcon")} *
              </FormLabel>
              <IconPicker
                value={selectedIcon || "settings"}
                onChange={setSelectedIcon}
                label=""
                icons={PROCEDURE_DIALOG_ICONS}
              />
            </Box>

            {/* Duration percentage */}
            <TextField
              placeholder={t("stageDurationPercentage")}
              value={durationPercentage}
              onChange={(e) => {
                setDurationPercentage(e.target.value);
                clearError("percentage");
              }}
              fullWidth
              size="small"
              type="number"
              inputProps={{ min: 0, max: 100 }}
              error={!!errors.percentage}
              helperText={errors.percentage}
            />

            {/* Time limit */}
            <Box>
              <FormLabel
                error={!!errors.timeLimit}
                sx={{ display: "block", mb: 1 }}
              >
                المهلة الزمنية *
              </FormLabel>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <TextField
                  value={deadlineHours}
                  onChange={(e) => {
                    setDeadlineHours(e.target.value);
                    clearError("timeLimit");
                  }}
                  size="small"
                  type="number"
                  inputProps={{ min: 0, style: { textAlign: "end" } }}
                  error={!!errors.timeLimit}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="caption">ساعات</Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  value={deadlineDays}
                  onChange={(e) => {
                    setDeadlineDays(e.target.value);
                    clearError("timeLimit");
                  }}
                  size="small"
                  type="number"
                  inputProps={{ min: 0, style: { textAlign: "end" } }}
                  error={!!errors.timeLimit}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="caption">أيام</Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flex: 1 }}
                />
              </Box>
              {errors.timeLimit && (
                <FormHelperText error sx={{ textAlign: "end", mt: 0.5 }}>
                  {errors.timeLimit}
                </FormHelperText>
              )}
            </Box>

            {/* Escalation target */}
            <Box>
              <SearchableSelect
                options={employees.map((emp) => ({
                  value: emp.id,
                  label: emp.name,
                }))}
                value={escalationUserId}
                onChange={(val) => setEscalationUserId(String(val))}
                placeholder="الجهة المصعد اليها"
                searchPlaceholder="البحث عن موظف..."
                noResultsText="لا توجد نتائج"
                label="الجهة المصعد اليها"
              />
              <FormHelperText sx={{ textAlign: "end", mt: 0.5 }}>
                الجهة المصعد اليها المصدر الاعتماد محول الاعتماد 18 ساعة
              </FormHelperText>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1.5 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={isSubmitting}
          sx={{ flex: 1 }}
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            isSubmitting || !name.trim() || (!deadlineHours && !deadlineDays)
          }
          sx={{ flex: 1 }}
        >
          {t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
