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
import { useQuery } from "@tanstack/react-query";

import { useState, useCallback, useEffect, useRef } from "react";
import { ClientRequestFormValues } from "../validation/requestForm.schema";

import {
  ClientRequestsApi,
  TermSettingChild,
  TermSettingGroup,
} from "@/services/api/client-requests";

interface RequestFormFieldsProps {
  control: Control<ClientRequestFormValues>;
  errors: FieldErrors<ClientRequestFormValues>;
}

// Collect only leaf IDs (nodes with no children) in a subtree
function collectLeafIds(node: TermSettingChild): number[] {
  if (!node.children || node.children.length === 0) {
    return [node.id];
  }
  const ids: number[] = [];
  node.children.forEach((child) => {
    ids.push(...collectLeafIds(child));
  });
  return ids;
}

// Tree node for children (level 1: intermediate, level 2: leaf)
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

  // Use leaf IDs scoped to this node's subtree only
  const leafIds = collectLeafIds(node);
  const isChecked =
    leafIds.length > 0 && leafIds.every((id) => selectedIds.includes(id));
  const isIndeterminate =
    !isChecked && leafIds.some((id) => selectedIds.includes(id));

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(leafIds, !isChecked);
  };

  return (
    <Box sx={{ pl: level * 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", py: 0.5 }}>
        <Checkbox
          size="small"
          checked={isChecked}
          indeterminate={isIndeterminate}
          onClick={handleToggle}
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

// Main group accordion (top level like "koko", "begoTest", etc.)
function TermGroupAccordion({
  group,
  selectedIds,
  onToggle,
}: {
  group: TermSettingGroup;
  selectedIds: number[];
  onToggle: (ids: number[], add: boolean) => void;
}) {
  // Collect only leaf IDs from THIS group's subtree
  const groupLeafIds: number[] = [];
  group.children.forEach((child) => {
    groupLeafIds.push(...collectLeafIds(child));
  });

  // selectedIds here is already scoped to this group only
  const selectedCount = selectedIds.filter((id) =>
    groupLeafIds.includes(id),
  ).length;
  const totalCount = groupLeafIds.length;
  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

  const handleGroupToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(groupLeafIds, !isAllSelected);
  };

  return (
    <Accordion
      disableGutters
      sx={{
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
      <AccordionDetails sx={{ p: 1 }}>
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
      const response = await ClientRequestsApi.getRequestTypes();
      return response.data.payload;
    },
  });

  const { data: sourcesData } = useQuery({
    queryKey: ["client-request-receiver-from"],
    queryFn: async () => {
      const response = await ClientRequestsApi.getSources();
      return response.data.payload;
    },
  });

  const { data: servicesData } = useQuery({
    queryKey: ["client-request-services"],
    queryFn: async () => {
      const response = await ClientRequestsApi.getServices();
      return response.data.payload;
    },
  });

  const { data: clientsData } = useQuery({
    queryKey: ["company-users-clients"],
    queryFn: async () => {
      const response = await ClientRequestsApi.getClients();
      return response.data.payload;
    },
  });

  const { data: termSettingsData } = useQuery({
    queryKey: ["term-service-settings"],
    queryFn: async () => {
      const response = await ClientRequestsApi.getTermSettings();
      return response.data.payload;
    },
  });

  // Controller for term_setting_id (multi-select tree)
  const { field: termSettingField } = useController({
    name: "term_setting_id",
    control,
    defaultValue: [],
  });

  // Per-group selection map: groupId -> Set of selected leaf IDs
  // This prevents cross-group contamination when leaf IDs repeat across groups
  const [groupSelections, setGroupSelections] = useState<
    Record<number, number[]>
  >({});

  const isMounted = useRef(false);

  // Sync groupSelections -> flat form value, skip initial mount to avoid hydration mismatch
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const flat = Object.values(groupSelections).flat();
    termSettingField.onChange(flat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupSelections]);

  const handleTermToggle = useCallback(
    (groupId: number, ids: number[], add: boolean) => {
      setGroupSelections((prev) => {
        const current = prev[groupId] ?? [];
        const next = add
          ? [...new Set([...current, ...ids])]
          : current.filter((id) => !ids.includes(id));
        return { ...prev, [groupId]: next };
      });
    },
    [],
  );

  return (
    <>
      {/* نوع الطلب - client_request_type_id */}
      <Controller
        name="client_request_type_id"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.client_request_type_id}>
            <InputLabel>{t("clientRequests.form.requestType")}</InputLabel>
            <Select
              {...field}
              value={field.value ?? ""}
              label={t("clientRequests.form.requestType")}
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
            <InputLabel>{t("clientRequests.form.source")}</InputLabel>
            <Select
              {...field}
              value={field.value ?? ""}
              label={t("clientRequests.form.source")}
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
              {t("clientRequests.form.ownerType")} *
            </FormLabel>
            <RadioGroup {...field} value={field.value ?? "individual"} row>
              <FormControlLabel
                value="individual"
                control={<Radio />}
                label={t("clientRequests.form.individual")}
              />
              <FormControlLabel
                value="company"
                control={<Radio />}
                label={t("clientRequests.form.company")}
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
            <InputLabel>{t("clientRequests.form.client")}</InputLabel>
            <Select
              {...field}
              value={field.value ?? ""}
              label={t("clientRequests.form.client")}
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
            label={t("clientRequests.form.subject")}
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
            <InputLabel>{t("clientRequests.form.serviceName")}</InputLabel>
            <Select
              value={String(field.value?.[0] ?? "")}
              onChange={(e) =>
                field.onChange(e.target.value ? [Number(e.target.value)] : [])
              }
              label={t("clientRequests.form.serviceName")}
            >
              {servicesData?.map((item) => (
                <MenuItem key={item.id} value={String(item.id)}>
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
              selectedIds={groupSelections[group.id] ?? []}
              onToggle={(ids, add) => handleTermToggle(group.id, ids, add)}
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
                ? `${field.value.length} ${t("clientRequests.form.attachments")}`
                : t("clientRequests.form.attachments")}
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
