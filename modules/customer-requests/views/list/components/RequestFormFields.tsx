import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  Button,
  Box,
  Collapse,
  FormHelperText,
} from "@mui/material";
import { ChevronDown, Paperclip } from "lucide-react";
import {
  Controller,
  Control,
  FieldErrors,
  useController,
} from "react-hook-form";
import { useTranslations } from "next-intl";
import { CustomerRequestFormValues } from "../validation/requestForm.schema";
import { useQuery } from "@tanstack/react-query";
import {
  CustomerRequestsApi,
  TermSettingGroup,
  TermSettingChild,
} from "@/services/api/customer-requests";
import { useState, useCallback } from "react";

type OptionItem = { id: number | string; name: string };

interface RequestFormFieldsProps {
  control: Control<CustomerRequestFormValues>;
  errors: FieldErrors<CustomerRequestFormValues>;
}

// Collect all descendant IDs from a node
function collectAllIds(node: TermSettingChild): number[] {
  const ids = [node.id];
  if (node.children) {
    node.children.forEach((child) => {
      ids.push(...collectAllIds(child));
    });
  }
  return ids;
}

// Tree node for children (level 2+)
function ChildTreeNode({
  node,
  selectedIds,
  onToggle,
  level,
}: {
  node: TermSettingChild;
  selectedIds: number[];
  onToggle: (ids: number[], add: boolean) => void;
  level: number;
}) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const allIds = collectAllIds(node);
  const isChecked = allIds.every((id) => selectedIds.includes(id));
  const isIndeterminate =
    !isChecked && allIds.some((id) => selectedIds.includes(id));

  const handleToggle = () => {
    onToggle(allIds, !isChecked);
  };

  return (
    <Box sx={{ pl: level * 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", py: 0.5 }}>
        <Checkbox
          size="small"
          color="error"
          checked={isChecked}
          indeterminate={isIndeterminate}
          onChange={handleToggle}
          sx={{ p: 0.5 }}
        />
        <Typography variant="body2" sx={{ flex: 1 }}>
          {node.name}
        </Typography>
        {hasChildren && (
          <Button
            size="small"
            onClick={() => setOpen((v) => !v)}
            sx={{ minWidth: 24, p: 0 }}
          >
            <ChevronDown
              size={14}
              style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)" }}
            />
          </Button>
        )}
      </Box>
      {hasChildren && (
        <Collapse in={open}>
          {node.children.map((child) => (
            <ChildTreeNode
              key={child.id}
              node={child}
              selectedIds={selectedIds}
              onToggle={onToggle}
              level={level + 1}
            />
          ))}
        </Collapse>
      )}
    </Box>
  );
}

// Main group accordion (top level like "إنشاءات هندسية", "مباني", etc.)
function TermGroupAccordion({
  group,
  selectedIds,
  onToggle,
}: {
  group: TermSettingGroup;
  selectedIds: number[];
  onToggle: (ids: number[], add: boolean) => void;
}) {
  // Collect all IDs from all children in this group
  const allGroupIds: number[] = [];
  group.children.forEach((child) => {
    allGroupIds.push(...collectAllIds(child));
  });

  const selectedCount = allGroupIds.filter((id) =>
    selectedIds.includes(id),
  ).length;
  const totalCount = allGroupIds.length;
  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

  const handleGroupToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(allGroupIds, !isAllSelected);
  };

  return (
    <Accordion
      disableGutters
      sx={{
        bgcolor: "#2d2d44",
        color: "#fff",
        "&:before": { display: "none" },
        borderRadius: 1,
        mb: 1,
      }}
    >
      <AccordionSummary
        expandIcon={<ChevronDown size={18} color="#fff" />}
        sx={{
          minHeight: 40,
          "& .MuiAccordionSummary-content": { alignItems: "center", gap: 1 },
        }}
      >
        <Checkbox
          size="small"
          color="error"
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onClick={handleGroupToggle}
          sx={{ p: 0.5 }}
        />
        <Typography variant="body2" sx={{ flex: 1 }}>
          {group.name}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          ({selectedCount}/{totalCount})
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ bgcolor: "#1e1e2f", p: 1 }}>
        {group.children.map((child) => (
          <ChildTreeNode
            key={child.id}
            node={child}
            selectedIds={selectedIds}
            onToggle={onToggle}
            level={0}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
}

export function RequestFormFields({ control, errors }: RequestFormFieldsProps) {
  const t = useTranslations();

  const { data: requestTypesData } = useQuery({
    queryKey: ["client-request-types"],
    queryFn: async () => {
      const response = await CustomerRequestsApi.getRequestTypes();
      return response.data.payload as OptionItem[];
    },
  });

  const { data: sourcesData } = useQuery({
    queryKey: ["client-request-receiver-from"],
    queryFn: async () => {
      const response = await CustomerRequestsApi.getSources();
      return response.data.payload as OptionItem[];
    },
  });

  const { data: servicesData } = useQuery({
    queryKey: ["client-request-services"],
    queryFn: async () => {
      const response = await CustomerRequestsApi.getServices();
      return response.data.payload as OptionItem[];
    },
  });

  const { data: clientsData } = useQuery({
    queryKey: ["company-users-clients"],
    queryFn: async () => {
      const response = await CustomerRequestsApi.getClients();
      return response.data.payload as OptionItem[];
    },
  });

  const { data: termSettingsData } = useQuery({
    queryKey: ["term-service-settings"],
    queryFn: async () => {
      const response = await CustomerRequestsApi.getTermSettings();
      return response.data.payload as TermSettingGroup[];
    },
  });

  // Controller for term_setting_id (multi-select tree)
  const { field: termSettingField } = useController({
    name: "term_setting_id",
    control,
    defaultValue: [],
  });

  const handleTermToggle = useCallback(
    (ids: number[], add: boolean) => {
      const current = termSettingField.value ?? [];
      let next: number[];
      if (add) {
        next = [...new Set([...current, ...ids])];
      } else {
        next = current.filter((id) => !ids.includes(id));
      }
      termSettingField.onChange(next);
    },
    [termSettingField],
  );

  return (
    <>
      {/* نوع الطلب - client_request_type_id */}
      <Controller
        name="client_request_type_id"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.client_request_type_id}>
            <InputLabel>{t("customerRequests.form.requestType")}</InputLabel>
            <Select
              {...field}
              value={field.value ?? ""}
              label={t("customerRequests.form.requestType")}
            >
              {requestTypesData?.map((item) => (
                <MenuItem key={item.id} value={String(item.id)}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
            {errors.client_request_type_id && (
              <FormHelperText>
                {errors.client_request_type_id.message}
              </FormHelperText>
            )}
          </FormControl>
        )}
      />

      {/* جهة الورود - client_request_receiver_from_id */}
      <Controller
        name="client_request_receiver_from_id"
        control={control}
        render={({ field }) => (
          <FormControl
            fullWidth
            error={!!errors.client_request_receiver_from_id}
          >
            <InputLabel>{t("customerRequests.form.source")}</InputLabel>
            <Select
              {...field}
              value={field.value ?? ""}
              label={t("customerRequests.form.source")}
            >
              {sourcesData?.map((item) => (
                <MenuItem key={item.id} value={String(item.id)}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
            {errors.client_request_receiver_from_id && (
              <FormHelperText>
                {errors.client_request_receiver_from_id.message}
              </FormHelperText>
            )}
          </FormControl>
        )}
      />

      {/* بيانات العميل - client_type radio */}
      <Controller
        name="client_type"
        control={control}
        render={({ field }) => (
          <FormControl>
            <FormLabel sx={{ mb: 0.5 }}>
              {t("customerRequests.form.ownerType")} *
            </FormLabel>
            <RadioGroup {...field} value={field.value ?? "individual"} row>
              <FormControlLabel
                value="individual"
                control={<Radio />}
                label={t("customerRequests.form.individual")}
              />
              <FormControlLabel
                value="company"
                control={<Radio />}
                label={t("customerRequests.form.company")}
              />
            </RadioGroup>
          </FormControl>
        )}
      />

      {/* العميل - client_id */}
      <Controller
        name="client_id"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.client_id}>
            <InputLabel>{t("customerRequests.form.client")}</InputLabel>
            <Select
              {...field}
              value={field.value ?? ""}
              label={t("customerRequests.form.client")}
            >
              {clientsData?.map((item) => (
                <MenuItem key={item.id} value={String(item.id)}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
            {errors.client_id && (
              <FormHelperText>{errors.client_id.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />

      {/* موضوع الطلب - content */}
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            value={field.value ?? ""}
            label={t("customerRequests.form.subject")}
            fullWidth
            multiline
            rows={3}
          />
        )}
      />

      {/* اسم الخدمة - service_ids dropdown */}
      <Controller
        name="service_ids"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel>{t("customerRequests.form.serviceName")}</InputLabel>
            <Select
              multiple
              value={field.value ?? []}
              onChange={(e) => field.onChange(e.target.value as number[])}
              label={t("customerRequests.form.serviceName")}
              renderValue={(selected) =>
                servicesData
                  ?.filter((s) => (selected as number[]).includes(Number(s.id)))
                  .map((s) => s.name)
                  .join(", ") || ""
              }
            >
              {servicesData?.map((item) => (
                <MenuItem key={item.id} value={Number(item.id)}>
                  <Checkbox
                    size="small"
                    color="error"
                    checked={(field.value ?? []).includes(Number(item.id))}
                  />
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      {/* term_setting_id — tree checkbox accordions matching design */}
      {termSettingsData && termSettingsData.length > 0 && (
        <Box>
          {termSettingsData.map((group) => (
            <TermGroupAccordion
              key={group.id}
              group={group}
              selectedIds={termSettingField.value ?? []}
              onToggle={handleTermToggle}
            />
          ))}
        </Box>
      )}

      {/* المرفقات - attachments */}
      <Controller
        name="attachments"
        control={control}
        render={({ field }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<Paperclip size={16} />}
              size="small"
            >
              {field.value && field.value.length > 0
                ? `${field.value.length} ${t("customerRequests.form.attachments")}`
                : t("customerRequests.form.attachments")}
              <input
                type="file"
                hidden
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  field.onChange(files);
                }}
              />
            </Button>
          </Box>
        )}
      />
    </>
  );
}
