import { FormConfig } from "@/modules/form-builder";
import {
  useFormInstance,
  useFormStore,
} from "@/modules/form-builder/hooks/useFormStore";
import LocationDialog from "./LocationDialog/LocationDialog";
import { baseURL } from "@/config/axios-config";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { weeklyScheduleDays } from "@/modules/attendance-departure/types/attendance";
import { getTimeUnits } from "../../constants/determinants";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AttendanceDaysDialog from "./AttendanceDaysDialog";
import { useTranslations } from "next-intl";
import {
  ScheduleDisplay,
  WeeklyScheduleDays,
} from "./components/ScheduleDisplay";

// Default time threshold in minutes
const DEFAULT_TIME_THRESHOLD_MINUTES = 30;

// Day names mapping
const dayNames = {
  sunday: "الأحد",
  monday: "الإثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء",
  thursday: "الخميس",
  friday: "الجمعة",
  saturday: "السبت",
};

const FORM_ID = "create-determinant-form";

const hasEnabledWeeklyScheduleDay = (weeklySchedule: unknown) => {
  if (!Array.isArray(weeklySchedule)) return false;
  return weeklySchedule.some((item: any) => {
    if (!item || typeof item !== "object") return false;
    if (!Array.isArray(item.periods) || item.periods.length === 0) return false;
    return item.periods.some(
      (period: any) =>
        period &&
        typeof period === "object" &&
        String(period.from || "").trim() &&
        String(period.to || "").trim(),
    );
  });
};

function AttendanceDaysSummary({
  title,
}: {
  title: string;
}) {
  const formInstance = useFormInstance(FORM_ID);
  const error = formInstance.errors?.attendance_days;
  return (
    <div className="flex items-center justify-between flex-wrap">
      <p className="text-white font-bold">{title}</p>
      {!!error && (
        <p className="w-full mt-2 text-sm text-destructive">{String(error)}</p>
      )}
    </div>
  );
}

const remapDeterminantBackendErrors = (
  errors: Record<string, string | string[]>,
) => {
  const mapped = { ...errors };
  if (mapped["constraint_config.time_rules.weekly_schedule"]) {
    mapped.attendance_days =
      mapped["constraint_config.time_rules.weekly_schedule"];
    delete mapped["constraint_config.time_rules.weekly_schedule"];
  }
  if (mapped["constraint_config.type_attendance"]) {
    mapped.type_attendance = mapped["constraint_config.type_attendance"];
    delete mapped["constraint_config.type_attendance"];
  }
  return mapped;
};

type PropsT = {
  refetchConstraints: () => void;
  refetchConstraintsList: () => void;
  onNewDeterminantCreated?: (determinant: any) => void;
  branchesData?: Array<{
    id: string;
    name: string;
    code: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  }>;
  t?: (key: string) => string;
  editConstraint?: any;
  // Translation functions passed as parameters
  attendanceDaysDialogTranslations?: (key: string) => string;
  formTranslationsFn?: (key: string) => string;
};
export const getDynamicDeterminantFormConfig = (props: PropsT): FormConfig => {
  // Props
  const { 
    refetchConstraints, 
    refetchConstraintsList,
    onNewDeterminantCreated,
    t, 
    editConstraint, 
    attendanceDaysDialogTranslations,
    formTranslationsFn 
  } = props;
  void _t;
  
  // Translation functions (passed as parameters instead of hooks)
  const translations = attendanceDaysDialogTranslations || ((key: string) => key);
  
  // Helper function to get translation - translations are already defined in messages
  const getFormTranslation = (key: string, fallback?: string) => {
    if (formTranslationsFn) {
      const result = formTranslationsFn(key);
      return result === key ? (fallback || key) : result;
    }
    return fallback || key;
  };
const formT = useTranslations("HRSettingsAttendanceDepartureModule.attendanceDeterminants.form");
  // Function to get text with default value
  const getText = (key: string, defaultText: string) => {
    return t ? formT(key) : defaultText;
  };

  // ------------- set default type attendance -------------
  const _type_attendance = [];
  if (Boolean(editConstraint?.config?.type_attendance?.location))
    _type_attendance.push("location");
  if (Boolean(editConstraint?.config?.type_attendance?.fingerprint))
    _type_attendance.push("fingerprint");

  // ------------- set default title -------------
  const isEdit = Boolean(editConstraint);
  const title = isEdit
    ? formT("editTitle")
    : formT("title");

  // ------------- set default location type -------------
  //latitude - longitude
  const latitude = editConstraint?.branch_locations?.[0]?.latitude;
  const longitude = editConstraint?.branch_locations?.[0]?.longitude;
  // is branch location empty
  const isBranchLocationEmpty = latitude == 0 && longitude == 0;

  const _location_type = !editConstraint
    ? "main"
    : isBranchLocationEmpty
    ? ""
    : Boolean(editConstraint?.config?.default_location)
    ? "main"
    : "custom";

  // ------------- set default branch ids -------------
  const _branch_ids =
    editConstraint?.branch_locations?.map(
      (branch: { branch_id: string | number }) => Number(branch.branch_id)
    ) ?? [];

  // ------------- set used days -------------
  const _weekly_schedule = Object.entries(
    (editConstraint?.config?.time_rules
      ?.weekly_schedule as weeklyScheduleDays) || {}
  )
    ?.filter(([dayName, dayConfig]) => dayConfig.enabled)
    ?.map(([dayName, dayConfig]) => {
      return {
        day: dayName,
        periods:
          dayConfig?.periods?.map((period) => ({
            from: period.start_time,
            to: period.end_time,
            early_period: (() => {
              const v = (dayConfig as any)?.early_clock_in_rules?.early_period;
              return v != null && v !== "" ? Number(v) : DEFAULT_TIME_THRESHOLD_MINUTES;
            })(),
            early_unit:
              (dayConfig as any)?.early_clock_in_rules?.early_unit || "minute",
            lateness_period: (() => {
              const v = (dayConfig as any)?.lateness_rules?.lateness_period;
              return v != null && v !== "" ? Number(v) : DEFAULT_TIME_THRESHOLD_MINUTES;
            })(),
            lateness_unit:
              (dayConfig as any)?.lateness_rules?.lateness_unit || "minute",
            extends_to_next_day: Boolean(period?.extends_to_next_day) ? 1 : undefined,
          })) ?? [],
      };
    });

  // ------------- return form config -------------
  const formConfig: FormConfig = {
    formId: "create-determinant-form",
    title,
    apiUrl: `${baseURL}/attendance/constraints`,
    initialValues: {
      constraint_name: editConstraint?.constraint_name || "",
      constraint_type: editConstraint?.constraint_code || "",
      branch_locations: editConstraint?.branch_locations || "[]",
      is_active: Boolean(editConstraint?.is_active),
      early_period: editConstraint?.config?.early_clock_in_rules?.early_period || "",
      early_unit: editConstraint?.config?.early_clock_in_rules?.early_unit || "",
      lateness_period: editConstraint?.config?.lateness_rules?.lateness_period || "",
      lateness_unit: editConstraint?.config?.lateness_rules?.lateness_unit || "",
      out_zone_rules_value:
        editConstraint?.config?.radius_enforcement
          ?.out_of_radius_time_threshold ?? DEFAULT_TIME_THRESHOLD_MINUTES,
      out_zone_rules_unit: editConstraint?.config?.radius_enforcement?.unit || "minute",
      type_attendance: _type_attendance.length > 0 ? _type_attendance : [],
      branch_ids: _branch_ids.length > 0 ? _branch_ids : [],
      location_type: _location_type,
      weekly_schedule: _weekly_schedule,
      show_location_dialog: false,
      show_attendance_days_dialog: false,
    },
    sections: [
      {
        title: formT("basicInfo"),
        fields: [
          {
            type: "text",
            name: "constraint_name",
            label: formT("determinantName"),
            placeholder: formT("determinantName"),
            required: true,
            validation: [
              {
                type: "required",
                message: formT("determinantNameRequired"),
              },
              {
                type: "pattern",
                value: /^[\p{L}\p{N}\s]+$/u,
                message: formT("determinantNamePattern"),
              },
            ],
          },
          {
            type: "select",
            name: "constraint_type",
            label: formT("systemType"),
            placeholder: formT("systemType"),
            dynamicOptions: {
              url: `${baseURL}/attendance/constraints/types`,
              valueField: "code",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            required: true,
            validation: [
              {
                type: "required",
                message: formT("systemTypeRequired"),
              },
            ],
          },
          {
            type: "hiddenObject",
            name: "is_active",
            label: "is_active",
            defaultValue: true,
          },
          {
            type: "hiddenObject",
            name: "branch_locations",
            label: "branch_locations",
            defaultValue: "[]",
          },
          {
            type: "select",
            isMulti: true,
            name: "branch_ids",
            label: formT("branches"),
            placeholder: formT("branches"),
            dynamicOptions: {
              url: `${baseURL}/management_hierarchies/list?type=branch`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            required: true,
            validation: [
              {
                type: "required",
                message: formT("branchesRequired"),
              },
            ],
          },
          {
            type: "radio",
            name: "location_type",
            label: formT("locationType"),
            options: [
              {
                value: "main",
                label: formT("mainLocation"),
              },
              {
                value: "custom",
                label: formT("customLocation"),
              },
            ],
            onChange: (value) => {
              if (value === "main" && isBranchLocationEmpty) {
                useFormStore
                  ?.getState()
                  .setValue(
                    "create-determinant-form",
                    "show_location_dialog",
                    true
                  );
              }
            },
            defaultValue: "main",
            required: true,
            validation: [
              {
                type: "required",
                message: formT("locationTypeRequired"),
              },
            ],
          },
          {
            type: "text",
            label: "",
            name: "open_map",
            render: () => {
              return (
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    useFormStore
                      ?.getState()
                      .setValue(
                        FORM_ID,
                        "show_location_dialog",
                        true
                      );
                  }}
                >
                  {formT("openMap")}
                </Button>
              );
            },
            condition: (values) => values.location_type === "custom",
          },
          {
            type: "hiddenObject",
            name: "show_location_dialog",
            label: "",
            defaultValue: false,
            render: () => {
              const location_type = useFormStore
                ?.getState()
                .getValues(FORM_ID).location_type;

              const show_location_dialog = useFormStore
                ?.getState()
                .getValues(FORM_ID).show_location_dialog;

              const showDialog =
                (location_type === "custom" &&
                  show_location_dialog !== false) ||
                (location_type === "main" &&
                  isBranchLocationEmpty &&
                  show_location_dialog !== false);

              return (
                <LocationDialog
                  isOpen={showDialog}
                  onClose={() => {
                    useFormStore
                      ?.getState()
                      .setValue(
                        FORM_ID,
                        "show_location_dialog",
                        false
                      );
                  }}
                />
              );
            },
          },
          // attendance days
          {
            name: "editedDay",
            type: "hiddenObject",
            label: "",
            defaultValue: {},
          },
          {
            name: "attendance_days",
            type: "text",
            label: "",
            render: () => {
              return (
                <div className="flex items-center justify-between">
                  <p className="text-white font-bold">
                    {formT("addAttendanceDays")}
                  </p>
                  <Button
                    onClick={() => {
                      useFormStore
                        ?.getState()
                        .setValue(
                          FORM_ID,
                          "show_attendance_days_dialog",
                          true
                        );
                    }}
                  >
                    <Plus />
                  </Button>
                </div>
              );
            },
            validation: [
              {
                type: "custom",
                validator: (_, values) =>
                  hasEnabledWeeklyScheduleDay(values?.weekly_schedule),
                message: getFormTranslation(
                  "attendanceDaysRequired",
                  "يجب إضافة يوم حضور واحد على الأقل",
                ),
              },
            ],
          },
          {
            name: "show_attendance_days",
            type: "text",
            label: "",
            render: () => {
              const _weekly_schedule = useFormStore
                ?.getState()
                .getValue(FORM_ID, "weekly_schedule");
              console.log(
                "show_attendance_days_weekly_schedule",
                _weekly_schedule
              );

              return (
                <div className="py-2">
                  {/* Use the ScheduleDisplay component */}
                  <ScheduleDisplay
                    t={getFormTranslation}
                    weeklySchedule={_weekly_schedule as WeeklyScheduleDays}
                  />
                </div>
              );
            },
          },
          // attendance days dialog
          {
            name: "show_attendance_days_dialog",
            type: "text",
            label: "",
            render: () => {
              const showDialog = useFormStore
                ?.getState()
                .getValues(
                  FORM_ID
                ).show_attendance_days_dialog;
              return (
                <AttendanceDaysDialog
                  isOpen={Boolean(showDialog)}
                  onClose={() => {
                    useFormStore
                      ?.getState()
                      .setValue(
                        FORM_ID,
                        "show_attendance_days_dialog",
                        false
                      );
                  }}
                />
              );
            },
          },
          {
            name: "determinant_seeting",
            label: "",
            type: "text",
            render: () => {
              return (
                <div>
                  <p className="font-bold">{formT("determinantSettings")}</p>
                </div>
              );
            },
          },
          {
            name: "out_zone_rules_unit",
            label: "out_zone_rules_unit",
            placeholder: "out_zone_rules_unit",
            type: "hiddenObject",
            validation: [],
          },
          {
            name: "out_zone_rules_value",
            label: formT("outsideZoneFor"),
            type: "text",
            placeholder: formT("outsideZoneFor"),
            postfix: (
              <div className="w-full h-full">
                <select
                  className="rounded-lg p-2 bg-transparent"
                  defaultValue={
                    editConstraint?.config?.radius_enforcement?.unit ??
                    getTimeUnits(translations)[0]?.id
                  }
                  onChange={(e) => {
                    const formStore = useFormStore.getState();
                    formStore.setValues(FORM_ID, {
                      out_zone_rules_unit: e.target.value,
                    });
                  }}
                >
                  {getTimeUnits(translations).map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      className="bg-sidebar text-black dark:text-white"
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            ),
            defaultValue:
              editConstraint?.config?.radius_enforcement
                ?.out_of_radius_time_threshold ?? 30,
            required: true,
            validation: [
              {
                type: "pattern",
                value: "^[0-9]+$",
                message: formT("outsideZoneNumbersOnly"),
              },
            ],
          },
          {
            type: "checkboxGroup",
            name: "type_attendance",
            label: formT("attendanceRegistrationVia"),
            isMulti: true,
            options: [
              { value: "location", label: formT("location") },
              // { value: "fingerprint", label: "بصمة الوجة" },
            ],
            required: true,
            validation: [
              {
                type: "required",
                message: formT("attendanceRegistrationRequired"),
              },
            ],
          },
        ],
      },
      // Day sections will be added dynamically based on working_days selection
    ],
    onSuccess: (response: any) => {
      // Refetch both constraints and constraints list to update the UI
      refetchConstraints();
      refetchConstraintsList();
      
      // If this is a new determinant (not edit) and we have response data, select it
      if (!editConstraint && response?.data && onNewDeterminantCreated) {
        // For POST requests, the response should contain the newly created determinant
        // The exact structure depends on your API response
        const newDeterminant = response.data;
        onNewDeterminantCreated(newDeterminant);
      }
    },
    resetOnSuccess: true,
    onSubmit: async (formData: Record<string, unknown>) => {
      const validationErrors: Record<string, string> = {};
      if (!String(formData.constraint_name || "").trim()) {
        validationErrors.constraint_name = getFormTranslation(
          "determinantNameRequired",
          "اسم المحدد مطلوب",
        );
      }
      if (!String(formData.constraint_type || "").trim()) {
        validationErrors.constraint_type = getFormTranslation(
          "systemTypeRequired",
          "نظام المحدد مطلوب",
        );
      }
      if (!hasEnabledWeeklyScheduleDay(formData.weekly_schedule)) {
        validationErrors.attendance_days = getFormTranslation(
          "attendanceDaysRequired",
          "يجب إضافة يوم حضور واحد على الأقل",
        );
      }
      if (
        !Array.isArray(formData.type_attendance) ||
        formData.type_attendance.length === 0
      ) {
        validationErrors.type_attendance = getFormTranslation(
          "attendanceRegistrationRequired",
          "تسجيل الحضور و الانصراف من خلال يجب أن يختار",
        );
      }
      if (Object.keys(validationErrors).length > 0) {
        return {
          success: false,
          message: getFormTranslation(
            "validationFailed",
            "يرجى مراجعة الحقول المطلوبة",
          ),
          errors: validationErrors,
        };
      }

      // Check for duplicate working days in the schedule
      if (formData.weekly_schedule && Array.isArray(formData.weekly_schedule)) {
        const weeklySchedule = formData.weekly_schedule as Array<any>;
        const days = weeklySchedule.map((item) => item.day);

        // Find duplicate days
        const uniqueDays = new Set(days);
        if (uniqueDays.size !== days.length) {
          // If duplicate days are found, return an error
          return {
            success: false,
            message: getFormTranslation("duplicateDayError", "هذا اليوم تم اختياره بالفعل"),
          };
        }

        // Format schedule data for submission
        const formattedSchedule = weeklySchedule.map((dayItem) => {
          // Handle dayItem.periods safely
          let periodsArray = [];

          try {
            if (dayItem?.periods) {
              if (Array.isArray(dayItem.periods)) {
                // If it's an array
                periodsArray = dayItem.periods.map((period: any) => {
                  // Ensure period is an object
                  if (period && typeof period === "object") {
                    return {
                      from: String(period.from || ""),
                      to: String(period.to || ""),
                      extends_to_next_day: Boolean(period.extends_to_next_day) ? 1 : undefined,
                    };
                  } else {
                    // If period is not an object
                    return { from: "", to: "" };
                  }
                });
              } else if (typeof dayItem.periods === "object") {
                // Handle case where periods is an object
                periodsArray = [
                  {
                    from: String(dayItem.periods.from || ""),
                    to: String(dayItem.periods.to || ""),
                    extends_to_next_day: Boolean(dayItem.periods.extends_to_next_day) ? 1 : undefined,
                  },
                ];
              }
            }
          } catch (e) {
            console.error("Error formatting periods:", e, dayItem);
          }

          return {
            day: dayItem.day,
            periods: periodsArray,
          };
        });

        // Update data with formatted schedule
        formData.formatted_schedule = formattedSchedule;
      }

      // Preparing location data
      let branch_locations = [];

      if (
        Boolean(
          formData.location_type === "main" &&
            props.branchesData &&
            !isBranchLocationEmpty
        )
      ) {
        // If default locations are selected, use the default locations for the selected branches
        const selectedBranches = formData.branch_ids || [];

        // Create branch locations array using branch data from props
        branch_locations = Array.isArray(selectedBranches)
          ? selectedBranches.map((branchId) => {
              const branchData = props.branchesData?.find(
                (branch) => branch.id == branchId
              );
              return {
                branchId: branchId,
                branchName: branchData?.name || "",
                latitude: branchData?.latitude || 0,
                longitude: branchData?.longitude || 0,
                address: branchData?.address || "",
                radius: "1000",
                isDefault: false,
              };
            })
          : [];
      } else {
        // If custom locations are selected, use the custom values
        // Handle both string and object formats for branch_locations
        if (typeof formData.branch_locations === "string") {
          // Parse from string format (used when setting via location dialog)
          branch_locations = JSON.parse(formData.branch_locations || "[]");
        } else if (Array.isArray(formData.branch_locations)) {
          // Already in array format (common in edit mode)
          branch_locations = formData.branch_locations;
        } else {
          // Fallback to empty array
          if (editConstraint?.branch_locations) {
            branch_locations = editConstraint?.branch_locations;
          } else {
            branch_locations = [];
          }
        }
      }

      const data = {
        constraint_name: formData.constraint_name,
        is_active: formData.is_active,
        constraint_type: formData.constraint_type,
        branch_ids: formData.branch_ids,
        branch_locations: branch_locations?.map((branch: any) => {
          return {
            branch_id: branch.branch_id || branch.branchId,
            name: branch.name || branch.branchName,
            address: "branch.address",
            latitude: branch.latitude,
            longitude: branch.longitude,
            radius:
              Number(branch.radius ?? "1") <= 0
                ? 1
                : Number(branch.radius ?? "1"),
          };
        }),
        constraint_config: {
          default_location: formData.location_type === "main",
          radius_enforcement: {
            end_shift_if_violated: true,
            out_of_radius_time_threshold: formData.out_zone_rules_value,
            unit: formData.out_zone_rules_unit ?? getTimeUnits(translations)[0]?.id,
          },
          time_rules: {
            subtype: "multiple_periods",
            weekly_schedule: Object.keys(dayNames).reduce<Record<string, any>>(
              (acc, day) => {
                // Print debug information to understand the data structure
                const daySchedules = Array.isArray(formData.formatted_schedule)
                  ? formData.formatted_schedule.filter(
                      (period: any) => period.day === day
                    )
                  : [];

                // Collect working hours for the day
                const dayPeriods: any[] = [];

                // Collect all working periods for this day
                // Ensure daySchedules is iterable
                if (Array.isArray(daySchedules)) {
                  daySchedules.forEach((dayItem: any) => {
                    if (dayItem && dayItem.periods) {
                      // Handle both array and non-array periods
                      if (Array.isArray(dayItem.periods)) {
                        dayItem.periods.forEach((period: any) => {
                          // Validate required fields
                          if (period && typeof period === "object") {
                            // Check for the correct field name
                            const startTime = period.from || "";
                            const endTime = period.to || "";
                            const extends_to_next_day = Boolean(
                              period.extends_to_next_day
                            );
                            console.log(
                              "period.extends_to_next_day 100",
                              period.extends_to_next_day
                            );

                            if (startTime && endTime) {
                              dayPeriods.push({
                                start_time: startTime,
                                end_time: endTime,
                                extends_to_next_day: extends_to_next_day,
                              });
                            }
                          }
                        });
                      } else if (
                        typeof dayItem.periods === "object" &&
                        dayItem.periods !== null
                      ) {
                        // Handle object periods
                        const period = dayItem.periods;
                        const startTime = period.from || "";
                        const endTime = period.to || "";
                        const extends_to_next_day = Boolean(
                          period.extends_to_next_day
                        );
                        console.log(
                          "period.extends_to_next_day 101",
                          period.extends_to_next_day
                        );

                        if (startTime && endTime) {
                          dayPeriods.push({
                            start_time: startTime,
                            end_time: endTime,
                            extends_to_next_day: extends_to_next_day,
                          });
                        }
                      }
                    }
                  });
                }

                let totalWorkHours = 0;

                dayPeriods.forEach((period) => {
                  try {
                    // Convert times to minutes
                    const [startHour, startMinute] = period.start_time
                      ?.split(":")
                      .map(Number);
                    const [endHour, endMinute] = period.end_time
                      ?.split(":")
                      .map(Number);

                    // Calculate the difference in minutes
                    const startTotalMinutes =
                      startHour * 60 + (startMinute || 0);
                    const endTotalMinutes = endHour * 60 + (endMinute || 0);
                    let diffMinutes = endTotalMinutes - startTotalMinutes;

                    // If the end time is before the start time, we assume it crosses midnight
                    if (diffMinutes < 0) {
                      diffMinutes += 24 * 60; // Add 24 hours
                    }

                    // Convert minutes to hours
                    const hours = diffMinutes / 60;
                    totalWorkHours += hours;
                  } catch (e) {
                    console.error("Error calculating hours:", e, period);
                  }
                });

                // Round to two decimal places
                totalWorkHours = Math.round(totalWorkHours * 100) / 100;

                // Get the current day's schedule data for rules
                const currentDaySchedule = Array.isArray(
                  formData.weekly_schedule
                )
                  ? formData.weekly_schedule.find(
                      (item: any) => item.day === day
                    )
                  : null;

                // Get the first period's rules (if exists) or use defaults
                const firstPeriod = currentDaySchedule?.periods?.[0] || {};
                const earlyPeriod = (() => {
                  const v = firstPeriod.early_period;
                  return v != null && v !== "" ? Number(v) : DEFAULT_TIME_THRESHOLD_MINUTES;
                })();
                const earlyUnit = firstPeriod.early_unit || "minute";
                const latenessPeriod = (() => {
                  const v = firstPeriod.lateness_period;
                  return v != null && v !== "" ? Number(v) : DEFAULT_TIME_THRESHOLD_MINUTES;
                })();
                const latenessUnit = firstPeriod.lateness_unit || "minute";

                // Add the day to the final object with enhanced structure
                acc[day] = {
                  enabled: dayPeriods.length > 0,
                  total_work_hours: totalWorkHours,
                  periods: dayPeriods,
                  early_clock_in_rules: {
                    prevent_early_clock_in: true,
                    early_period: earlyPeriod,
                    early_unit: earlyUnit,
                  },
                  lateness_rules: {
                    prevent_lateness: true,
                    lateness_period: latenessPeriod,
                    lateness_unit: latenessUnit,
                  },
                };

                return acc;
              },
              {} as Record<string, any>
            ),
          },
          type_attendance: {
            location:
              (formData.type_attendance as Array<string>)?.indexOf(
                "location"
              ) !== -1,
            fingerprint:
              (formData.type_attendance as Array<string>)?.indexOf(
                "fingerprint"
              ) !== -1,
          },
        },
      };

      const result = await defaultSubmitHandler(
        data,
        formConfig,
        {
          url: Boolean(editConstraint)
            ? `${baseURL}/attendance/constraints/${editConstraint?.id}`
            : `${baseURL}/attendance/constraints`,
          method: Boolean(editConstraint) ? "PUT" : "POST",
        }
      );
      if (!result.success && result.errors) {
        return {
          ...result,
          errors: remapDeterminantBackendErrors(result.errors),
        };
      }
      return result;
    },
    submitButtonText: formT("submitButtonText"),
    cancelButtonText: formT("cancelButtonText"),
  };
  
  return formConfig;
};
