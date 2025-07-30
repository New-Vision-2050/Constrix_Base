import { FormConfig } from "@/modules/form-builder";
import { useEffect } from "react";
import { useFormStore } from "@/modules/form-builder/hooks/useFormStore";
import LocationDialog from "./LocationDialog/LocationDialog";
import { baseURL } from "@/config/axios-config";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { weeklyScheduleDays } from "@/modules/attendance-departure/types/attendance";
import { TimeUnits } from "../../constants/determinants";
import { Button } from "@/components/ui/button";

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

const daysList = Object.entries(dayNames).map(([key, value]) => ({
  value: key,
  label: value,
}));

type PropsT = {
  refetchConstraints: () => void;
  branchesData?: Array<{
    id: string;
    name: string;
    code: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  }>;
  // Optional translation function
  t?: (key: string) => string;
  // Optional constraint for editing mode
  editConstraint?: any;
};
// Function to get form config with dynamic day sections
export const getDynamicDeterminantFormConfig = (props: PropsT): FormConfig => {
  const { refetchConstraints, t, editConstraint } = props;

  // Función auxiliar para obtener textos traducidos o usar valores predeterminados
  const getText = (key: string, defaultText: string) => {
    return t ? t(key) : defaultText;
  };

  const _type_attendance = [];

  if (Boolean(editConstraint?.config?.type_attendance?.location))
    _type_attendance.push("location");
  if (Boolean(editConstraint?.config?.type_attendance?.fingerprint))
    _type_attendance.push("fingerprint");

  return {
    formId: "create-determinant-form",
    title: getText("form.title", "إضافة محدد جديد"),
    apiUrl: `${baseURL}/attendance/constraints`,
    initialValues: {
      constraint_name: editConstraint?.constraint_name,
      constraint_type: editConstraint?.constraint_code,
      branch_locations: editConstraint?.branch_locations,
      is_active: Boolean(editConstraint?.is_active),
      early_period: editConstraint?.config?.early_clock_in_rules?.early_period,
      early_unit: editConstraint?.config?.early_clock_in_rules?.early_unit,
      lateness_period: editConstraint?.config?.lateness_rules?.lateness_period,
      lateness_unit: editConstraint?.config?.lateness_rules?.lateness_unit,
      out_zone_rules_value:
        editConstraint?.config?.radius_enforcement
          ?.out_of_radius_time_threshold ?? DEFAULT_TIME_THRESHOLD_MINUTES,
      out_zone_rules_unit: editConstraint?.config?.radius_enforcement?.unit,
      type_attendance: _type_attendance,
      branch_ids:
        editConstraint?.branch_locations?.map(
          (branch: { branch_id: string | number }) => Number(branch.branch_id)
        ) ?? [],
      location_type: !editConstraint
        ? "main"
        : Boolean(editConstraint?.config?.default_location)
        ? "main"
        : "custom",
      weekly_schedule: Object.entries(
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
                early_period:
                  (dayConfig as any)?.early_clock_in_rules?.early_period ||
                  DEFAULT_TIME_THRESHOLD_MINUTES,
                early_unit:
                  (dayConfig as any)?.early_clock_in_rules?.early_unit ||
                  "minute",
                lateness_period:
                  (dayConfig as any)?.lateness_rules?.lateness_period ||
                  DEFAULT_TIME_THRESHOLD_MINUTES,
                lateness_unit:
                  (dayConfig as any)?.lateness_rules?.lateness_unit || "minute",
              })) ?? [],
          };
        }),
      show_location_dialog: false,
    },
    sections: [
      {
        title: getText("form.basicInfo", "المعلومات الأساسية"),
        fields: [
          {
            type: "text",
            name: "constraint_name",
            label: getText("form.determinantName", "اسم المحدد"),
            placeholder: getText(
              "form.determinantNamePlaceholder",
              "فرع القاهرة"
            ),
            required: true,
            validation: [
              {
                type: "required",
                message: getText(
                  "form.determinantNameRequired",
                  "اسم المحدد مطلوب"
                ),
              },
              {
                type: "pattern",
                value: /^[\p{L}\p{N}\s]+$/u,
                message: getText(
                  "form.determinantNamePattern",
                  "اسم المحدد يجب أن يحتوي على حروف وأرقام فقط"
                ),
              },
            ],
          },
          {
            type: "select",
            name: "constraint_type",
            label: getText("form.systemType", "نظام المحدد"),
            placeholder: getText("form.systemTypePlaceholder", "منتظم"),
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
                message: getText(
                  "form.systemTypeRequired",
                  "نظام المحدد مطلوب"
                ),
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
            label: getText("form.branches", "الفروع"),
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
                message: getText(
                  "form.branchesRequired",
                  "يجب اختيار فرع واحد على الأقل"
                ),
              },
            ],
          },
          {
            type: "radio",
            name: "location_type",
            label: getText("form.locationType", "نوع الموقع"),
            options: [
              {
                value: "main",
                label: getText("form.mainLocation", "موقع الفرع الافتراضي"),
              },
              {
                value: "custom",
                label: getText("form.customLocation", "موقع مخصص لكل فرع"),
              },
            ],
            defaultValue: "main",
            required: true,
            validation: [
              {
                type: "required",
                message: "يجب اختيار نوع الموقع",
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
                        "create-determinant-form",
                        "show_location_dialog",
                        true
                      );
                  }}
                >
                  {getText("form.openMap", "فتح الخريطة")}
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
            render: (props: any) => {
              const location_type = useFormStore
                ?.getState()
                .getValues("create-determinant-form").location_type;

              const show_location_dialog = useFormStore
                ?.getState()
                .getValues("create-determinant-form").show_location_dialog;

              const showDialog =
                location_type === "custom" && show_location_dialog !== false;

              return (
                <LocationDialog
                  isOpen={showDialog}
                  onClose={() => {
                    useFormStore
                      ?.getState()
                      .setValue(
                        "create-determinant-form",
                        "show_location_dialog",
                        false
                      );
                  }}
                />
              );
            },
          },
          {
            name: "weekly_schedule",
            label: getText("form.workingDays", "أيام العمل"),
            type: "dynamicRows",
            dynamicRowOptions: {
              enableDrag: true,
              rowFields: [
                {
                  type: "select",
                  name: "day",
                  label: "اليوم",
                  placeholder: "اختر يوم",
                  options: daysList,
                  validation: [
                    {
                      type: "required",
                      message: "اليوم مطلوب",
                    },
                  ],
                },
                {
                  name: "periods",
                  label: getText("form.addPeriod", "إضافة فترة"),
                  type: "dynamicRows",
                  dynamicRowOptions: {
                    enableDrag: true,
                    rowFields: [
                      {
                        type: "time",
                        name: "from",
                        label: getText("form.periodStart", "بداية الفترة"),
                        placeholder: getText(
                          "form.periodStartPlaceholder",
                          "09:00"
                        ),
                        validation: [
                          {
                            type: "required",
                            message: getText(
                              "form.periodStartRequired",
                              "بداية الفترة مطلوبة"
                            ),
                          },
                        ],
                      },
                      {
                        type: "time",
                        name: "to",
                        label: getText("form.periodEnd", "نهاية الفترة"),
                        placeholder: getText(
                          "form.periodEndPlaceholder",
                          "17:00"
                        ),
                        validation: [
                          {
                            type: "required",
                            message: getText(
                              "form.periodEndRequired",
                              "نهاية الفترة مطلوبة"
                            ),
                          },
                          {
                            type: "custom",
                            validator: (value: string, formValues: any) => {
                              const fromTime = formValues.from || "";
                              const toTime = value || "";

                              // Skip validation if either time is not set
                              if (!fromTime || !toTime) return true;

                              // Convert times to comparable format (minutes since midnight)
                              const fromParts = fromTime.split(":");
                              const toParts = toTime.split(":");

                              if (
                                fromParts.length !== 2 ||
                                toParts.length !== 2
                              )
                                return true;

                              const fromMinutes =
                                parseInt(fromParts[0], 10) * 60 +
                                parseInt(fromParts[1], 10);
                              const toMinutes =
                                parseInt(toParts[0], 10) * 60 +
                                parseInt(toParts[1], 10);

                              // Return true if valid (to time is greater than or equal to from time)
                              return toMinutes >= fromMinutes;
                            },
                            message:
                              getText(
                                "form.periodEndMustBeAfterStart",
                                "وقت النهاية يجب أن يكون بعد وقت البداية"
                              ) ||
                              getText(
                                "form.startTimeBeforeEndTime",
                                "وقت البداية قبل وقت النهاية"
                              ),
                          },
                        ],
                      },
                      {
                        name: "period_seeting",
                        label: "",
                        type: "text",
                        render: () => {
                          return (
                            <div>
                              <p className="font-bold">إعدادات الفترة</p>
                            </div>
                          );
                        },
                      },
                      {
                        name: "early_period",
                        label: "السماح بالحضور لمدة (قبل العمل)",
                        type: "number",
                        placeholder: "السماح بالحضور لمدة (قبل العمل)",
                        required: true,
                        validation: [
                          {
                            type: "pattern",
                            value: "^[0-9]+$",
                            message:
                              "السماح بالحضور لمدة (قبل العمل) يجب أن تكون أرقام فقط",
                          },
                        ],
                      },
                      {
                        name: "early_unit",
                        label: "وحدة السماح بالحضور لمدة (قبل العمل)",
                        placeholder: "وحدة السماح بالحضور لمدة (قبل العمل)",
                        type: "select",
                        options: TimeUnits?.map((item) => ({
                          value: item.id,
                          label: item.name,
                        })),
                        validation: [],
                      },
                      {
                        name: "lateness_period",
                        label: "السماح بالتأخير لمدة",
                        type: "number",
                        placeholder: "السماح بالتأخير لمدة",
                        required: true,
                        validation: [
                          {
                            type: "pattern",
                            value: "^[0-9]+$",
                            message:
                              "السماح بالتأخير لمدة يجب أن تكون أرقام فقط",
                          },
                        ],
                      },
                      {
                        name: "lateness_unit",
                        label: "وحدة السماح بالتأخير لمدة",
                        placeholder: "وحدة السماح بالتأخير لمدة",
                        type: "select",
                        options: TimeUnits?.map((item) => ({
                          value: item.id,
                          label: item.name,
                        })),
                        validation: [],
                      },
                    ],
                    minRows: 1,
                    maxRows: 5,
                    columns: 1,
                  },
                },
              ],
              minRows: 1,
              maxRows: 5,
              columns: 1,
            },
          },
          {
            name: "determinant_seeting",
            label: "",
            type: "text",
            render: () => {
              return (
                <div>
                  <p className="font-bold">إعدادات المحدد</p>
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
            label: "خارج المحدد لمدة",
            type: "number",
            placeholder: "خارج المحدد لمدة",
            postfix: (
              <div className="w-full h-full">
                <select
                  className="rounded-lg p-2 bg-transparent"
                  defaultValue={
                    editConstraint?.config?.radius_enforcement?.unit ??
                    TimeUnits?.[0]?.id
                  }
                  onChange={(e) => {
                    const formStore = useFormStore.getState();
                    formStore.setValues(`create-determinant-form`, {
                      out_zone_rules_unit: e.target.value,
                    });
                  }}
                >
                  {TimeUnits?.map((item) => (
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
                message: "خارج المحدد لمدة يجب أن تكون أرقام فقط",
              },
            ],
          },
          {
            type: "checkboxGroup",
            name: "type_attendance",
            label: "تسجيل الحضور و الانصراف من خلال",
            isMulti: true,
            options: [
              { value: "location", label: "الموقع" },
              { value: "fingerprint", label: "بصمة الوجة" },
            ],
            required: true,
            validation: [
              {
                type: "required",
                message: "تسجيل الحضور و الانصراف من خلال يجب أن يختار",
              },
            ],
          },
        ],
      },
      // Day sections will be added dynamically based on working_days selection
    ],
    onSuccess: () => {
      refetchConstraints();
    },
    resetOnSuccess: true,
    onSubmit: async (formData: Record<string, unknown>) => {
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
            message: "This day has already been selected",
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

      if (Boolean(formData.location_type === "main" && props.branchesData)) {
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
                radius: "100",
                isDefault: false,
              };
            })
          : [];
      } else {
        // If custom locations are selected, use the custom values
        // Handle both string and object formats for branch_locations
        if (typeof formData.branch_locations === 'string') {
          // Parse from string format (used when setting via location dialog)
          branch_locations = JSON.parse(formData.branch_locations || '[]');
        } else if (Array.isArray(formData.branch_locations)) {
          // Already in array format (common in edit mode)
          branch_locations = formData.branch_locations;
        } else {
          // Fallback to empty array
          if(editConstraint?.branch_locations){
            branch_locations = editConstraint?.branch_locations;
          }else{
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
            unit: formData.out_zone_rules_unit ?? TimeUnits?.[0]?.id,
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
                let dayPeriods: any[] = [];

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

                            if (startTime && endTime) {
                              dayPeriods.push({
                                start_time: startTime,
                                end_time: endTime,
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

                        if (startTime && endTime) {
                          dayPeriods.push({
                            start_time: startTime,
                            end_time: endTime,
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
                      .split(":")
                      .map(Number);
                    const [endHour, endMinute] = period.end_time
                      .split(":")
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
                const earlyPeriod =
                  Number(firstPeriod.early_period) ||
                  DEFAULT_TIME_THRESHOLD_MINUTES;
                const earlyUnit = firstPeriod.early_unit || "minute";
                const latenessPeriod =
                  Number(firstPeriod.lateness_period) ||
                  DEFAULT_TIME_THRESHOLD_MINUTES;
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

      return await defaultSubmitHandler(
        data,
        getDynamicDeterminantFormConfig({ refetchConstraints, editConstraint }),
        {
          url: Boolean(editConstraint)
            ? `${baseURL}/attendance/constraints/${editConstraint.id}`
            : `${baseURL}/attendance/constraints`,
          method: Boolean(editConstraint) ? "PUT" : "POST",
        }
      );
    },
    submitButtonText: getText("form.submitButtonText", "حفظ المحدد"),
    cancelButtonText: getText("form.cancelButtonText", "إلغاء"),
  };
};
