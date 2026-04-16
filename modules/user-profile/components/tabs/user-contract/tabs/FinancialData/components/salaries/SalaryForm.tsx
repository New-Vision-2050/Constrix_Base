"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BugReportIcon from "@mui/icons-material/BugReport";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { apiClient, baseURL } from "@/config/axios-config";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useFinancialDataCxt } from "../../context/financialDataCxt";
import { SalaryTypes } from "./salary_type_enum";
import GetUserEmploymentContractData from "../../../FunctionalAndContractualData/api/get-user-employment-contract";

// Pure helper — same formula as the original implementation
const calculateHourlyRate = (
  periodId: string | undefined,
  salary: string | undefined,
  weeklyWorkHours: number | undefined,
  periodName: string | undefined,
): string => {
  if (!periodId || !salary || !weeklyWorkHours || !periodName) return "";

  const salaryValue = Number(salary);
  if (isNaN(salaryValue) || salaryValue <= 0 || weeklyWorkHours <= 0) return "";

  const nameLower = periodName.toLowerCase();
  let totalHours = 0;

  if (nameLower.includes("يومي") || nameLower.includes("daily")) {
    totalHours = (weeklyWorkHours * 4) / 30;
  } else if (nameLower.includes("اسبوع") || nameLower.includes("weekly")) {
    totalHours = weeklyWorkHours;
  } else if (nameLower.includes("شهري") || nameLower.includes("monthly")) {
    totalHours = weeklyWorkHours * 4;
  } else if (nameLower.includes("سنوي") || nameLower.includes("yearly")) {
    totalHours = weeklyWorkHours * 4 * 12;
  } else {
    return "";
  }

  return (salaryValue / totalHours).toFixed(2);
};

type SalaryFormValues = {
  salary_type_code: string;
  salary: string;
  period_id: string;
  description: string;
};

interface SalaryFormProps {
  readOnly?: boolean;
}

export default function SalaryForm({ readOnly = false }: SalaryFormProps) {
  const t = useTranslations("common");
  const tSalary = useTranslations("UserProfile.nestedTabs.basicSalaryEdit");

  const { userId, handleRefetchDataStatus } = useUserProfileCxt();
  const { userSalary, handleRefreshSalaryData } = useFinancialDataCxt();
  const { data: userContractData } = useQuery({
    queryKey: ["user_contract_data", userId],
    queryFn: () => GetUserEmploymentContractData(userId as string),
    enabled: Boolean(userId),
  });

  // Fetch periods once — React Query deduplicates with any other consumer of this key
  const { data: periodsData } = useQuery({
    queryKey: ["periods"],
    queryFn: async () => {
      const response = await apiClient.get(`${baseURL}/periods`);
      return response.data.payload as { id: string; name: string }[];
    },
  });

  // Fetch salary types once
  const { data: salaryTypesData } = useQuery({
    queryKey: ["salary_types"],
    queryFn: async () => {
      const response = await apiClient.get(`${baseURL}/salary_types`);
      return response.data.payload as { code: string; name: string }[];
    },
  });

  // Synchronous id → name lookup — never stale, no async per-keystroke fetch
  const periodNameMap = useMemo(() => {
    const map = new Map<string, string>();
    periodsData?.forEach((p) => map.set(p.id, p.name));
    return map;
  }, [periodsData]);

  const schema = z.object({
    salary_type_code: z
      .string()
      .min(1, tSalary("validation.basicSalaryRequired")),
    salary: z.string().min(1, tSalary("validation.basicSalaryAmountRequired")),
    period_id: z.string().min(1, tSalary("validation.paymentCycleRequired")),
    description: z.string().optional(),
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SalaryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      salary_type_code: "",
      salary: "",
      period_id: "",
      description: "",
    },
  });

  // Populate form once userSalary finishes loading (handles edit mode)
  useEffect(() => {
    if (!userSalary) return;
    reset({
      salary_type_code: userSalary.salary_type_code ?? "",
      salary: userSalary.salary?.toString() ?? "",
      period_id: userSalary.period_id ?? "",
      description: userSalary.description ?? "",
    });
  }, [userSalary, reset]);

  const watchedType = watch("salary_type_code");
  const watchedSalary = watch("salary");
  const watchedPeriodId = watch("period_id");

  // Derived — never stored in form state, always in sync with inputs
  const hourRate = useMemo(() => {
    if (watchedType !== SalaryTypes.constants) return "";
    const periodName = periodNameMap.get(watchedPeriodId);
    return calculateHourlyRate(
      watchedPeriodId,
      watchedSalary,
      userContractData?.working_hours,
      periodName,
    );
  }, [
    watchedType,
    watchedSalary,
    watchedPeriodId,
    periodNameMap,
    userContractData?.working_hours,
  ]);

  const handleDebugLog = () => {
    const periodName = periodNameMap.get(watchedPeriodId);
    const salaryNum = Number(watchedSalary);
    const hours = userContractData?.working_hours;
    const nameLower = periodName?.toLowerCase() ?? "";
    let totalHours = 0;
    let periodType = "unknown";
    if (nameLower.includes("يومي") || nameLower.includes("daily")) {
      totalHours = ((hours ?? 0) * 4) / 30;
      periodType = "daily";
    } else if (nameLower.includes("اسبوع") || nameLower.includes("weekly")) {
      totalHours = hours ?? 0;
      periodType = "weekly";
    } else if (nameLower.includes("شهري") || nameLower.includes("monthly")) {
      totalHours = (hours ?? 0) * 4;
      periodType = "monthly";
    } else if (nameLower.includes("سنوي") || nameLower.includes("yearly")) {
      totalHours = (hours ?? 0) * 4 * 12;
      periodType = "yearly";
    }
    console.group(
      "%c⏱ Hourly Rate Debug",
      "color: #1976d2; font-weight: bold; font-size: 14px",
    );
    console.table({
      salary_type_code: watchedType,
      salary_value: salaryNum,
      period_id: watchedPeriodId,
      period_name: periodName ?? "(not found in map)",
      period_type_detected: periodType,
      working_hours_per_week: hours ?? "(undefined — contract not loaded)",
      total_period_hours: totalHours,
      computed_hourly_rate:
        totalHours > 0
          ? (salaryNum / totalHours).toFixed(2)
          : "(cannot compute)",
      final_result: hourRate || "(empty)",
    });
    console.log(
      "%cperiodNameMap contents:",
      "color: #666",
      Object.fromEntries(periodNameMap),
    );
    console.log("%cuserContractData:", "color: #666", userContractData);
    console.groupEnd();
  };

  const onSubmit = async (data: SalaryFormValues) => {
    try {
      await apiClient.post(`${baseURL}/user_salaries`, {
        ...data,
        hour_rate: hourRate,
        user_id: userId,
      });
      toast.success(tSalary("saveSuccess"));
      handleRefetchDataStatus();
      handleRefreshSalaryData();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          status: number;
          data?: { errors?: Record<string, string[]> };
        };
      };
      if (axiosErr?.response?.status === 422) {
        const backendErrors = axiosErr.response?.data?.errors;
        if (backendErrors) {
          Object.entries(backendErrors).forEach(([field, messages]) => {
            setError(field as keyof SalaryFormValues, {
              type: "server",
              message: messages[0],
            });
          });
          return;
        }
      }
      toast.error(tSalary("saveError"));
    }
  };

  const disabled = readOnly || isSubmitting;
  const isConstant = watchedType === SalaryTypes.constants;
  const isPercentage = watchedType === SalaryTypes.percentage;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 3,
          mb: readOnly ? 0 : 3,
        }}
      >
        {/* Salary Type */}
        <FormControl
          fullWidth
          size="small"
          error={!!errors.salary_type_code}
          disabled={disabled}
        >
          <InputLabel id="salary-type-label">
            {tSalary("basicSalary")}
          </InputLabel>
          <Controller
            name="salary_type_code"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="salary-type-label"
                label={tSalary("basicSalary")}
              >
                {salaryTypesData?.map((type) => (
                  <MenuItem key={type.code} value={type.code}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.salary_type_code && (
            <FormHelperText>{errors.salary_type_code.message}</FormHelperText>
          )}
        </FormControl>

        {/* Salary Amount */}
        <Controller
          name="salary"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label={tSalary("basicSalaryAmount")}
              placeholder={tSalary("placeholders.basicSalaryAmount")}
              error={!!errors.salary}
              helperText={errors.salary?.message}
              disabled={disabled}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {isPercentage ? "%" : "ر.س"}
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />

        {/* Payment Cycle */}
        <FormControl
          fullWidth
          size="small"
          error={!!errors.period_id}
          disabled={disabled}
        >
          <InputLabel id="period-label">{tSalary("paymentCycle")}</InputLabel>
          <Controller
            name="period_id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="period-label"
                label={tSalary("paymentCycle")}
              >
                {periodsData?.map((period) => (
                  <MenuItem key={period.id} value={period.id}>
                    {period.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.period_id && (
            <FormHelperText>{errors.period_id.message}</FormHelperText>
          )}
        </FormControl>

        {/* Description — only for percentage type */}
        {isPercentage && (
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                label="وصف اساس حساب الراتب"
                placeholder="وصف اساس حساب الراتب"
                error={!!errors.description}
                helperText={errors.description?.message}
                disabled={disabled}
              />
            )}
          />
        )}

        {/* Hourly Rate — full-width result card, only visible for constant type */}
        {isConstant && (
          <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
            {hourRate ? (
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  borderRadius: 2,
                  borderColor: "primary.main",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    <AccessTimeIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {tSalary("hourlyRate")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {periodNameMap.get(watchedPeriodId) ?? ""}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ textAlign: "end" }}>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color="primary.main"
                    lineHeight={1}
                  >
                    {hourRate}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ر.س / ساعة
                  </Typography>
                </Box>
              </Paper>
            ) : (
              <Alert
                severity="info"
                icon={<AccessTimeIcon fontSize="small" />}
                sx={{ borderRadius: 2 }}
              >
                {readOnly
                  ? "لم يتم حساب قيمة الساعة بعد"
                  : "أدخل مبلغ الراتب ودورة القبض لحساب قيمة الساعة تلقائياً"}
              </Alert>
            )}
          </Box>
        )}
      </Box>

      {!readOnly && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              size="small"
              onClick={handleDebugLog}
              startIcon={<BugReportIcon fontSize="small" />}
              sx={{ opacity: 0.6, fontSize: "0.7rem" }}
            >
              Debug hourly rate
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : null
              }
            >
              {t("save")}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
