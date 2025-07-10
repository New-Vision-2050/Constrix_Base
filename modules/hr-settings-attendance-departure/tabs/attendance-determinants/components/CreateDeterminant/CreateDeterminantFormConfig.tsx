import { FormConfig } from "@/modules/form-builder";
import { useEffect } from "react";
import { useFormStore } from "@/modules/form-builder/hooks/useFormStore";
import LocationDialog from "./LocationDialog/LocationDialog";
import { baseURL } from "@/config/axios-config";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

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
};
// Function to get form config with dynamic day sections
export const getDynamicDeterminantFormConfig = (props: PropsT): FormConfig => {
  const { refetchConstraints } = props;

  return {
    formId: "create-determinant-form",
    title: "إضافة محدد جديد",
    wizard: true,
    apiUrl: `${baseURL}/attendance/constraints`,
    sections: [
      {
        title: "المعلومات الأساسية",
        fields: [
          {
            type: "text",
            name: "constraint_name",
            label: "اسم المحدد",
            placeholder: "فرع القاهرة",
            required: true,
            validation: [
              {
                type: "required",
                message: "اسم المحدد مطلوب",
              },
              {
                type: "pattern",
                value: /^[\p{L}\p{N}\s]+$/u,
                message: "اسم المحدد يجب أن يحتوي على حروف وأرقام فقط",
              },
            ],
          },
          {
            type: "select",
            name: "constraint_type",
            label: "نظام المحدد",
            placeholder: "منتظم",
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
                message: "نظام المحدد مطلوب",
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
            label: "الفروع",
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
                message: "يجب اختيار فرع واحد على الأقل",
              },
            ],
          },
          {
            type: "radio",
            name: "location_type",
            label: "نوع الموقع",
            options: [
              { value: "main", label: "موقع الفرع الافتراضي" },
              { value: "custom", label: "تحديد موقع لكل فرع من الفروع" },
            ],
            defaultValue: "main",
            required: true,
            validation:[
              {
                type: "required",
                message: "يجب اختيار نوع الموقع",
              },
            ],
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
              // control dialog open state
              useEffect(() => {
                if (location_type === "custom") {
                  useFormStore
                    ?.getState()
                    .setValue(
                      "create-determinant-form",
                      "show_location_dialog",
                      true
                    );
                }
              }, [location_type]);

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
            label: "أضافة يوم عمل",
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
                  label: "أضافة فترة عمل",
                  type: "dynamicRows",
                  dynamicRowOptions: {
                    enableDrag: true,
                    rowFields: [
                      {
                        type: "text",
                        name: "from",
                        label: "بداية الفترة",
                        placeholder: "09:00",
                        validation: [
                          {
                            type: "required",
                            message: "بداية الفترة مطلوبة",
                          },
                          {
                            type: "pattern",
                            value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                            message: "يجب إدخال وقت صحيح بتنسيق ساعات:دقائق مثل 09:00",
                          },
                        ],
                      },
                      {
                        type: "text",
                        name: "to",
                        label: "نهاية الفترة",
                        placeholder: "17:00",
                        validation: [
                          {
                            type: "required",
                            message: "نهاية الفترة مطلوبة",
                          },
                          {
                            type: "pattern",
                            value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                            message: "يجب إدخال وقت صحيح بتنسيق ساعات:دقائق مثل 17:00",
                          },
                        ],
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
        ],
      },
      // Day sections will be added dynamically based on working_days selection
    ],
    onSuccess: () => {
      refetchConstraints();
    },
    resetOnSuccess:true,
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
              console.log('branchData',branchData)
              console.log('branchId',branchId)
              console.log('selectedBranches',selectedBranches)
              console.log('branchDatabranchDatabranchData',branchData)
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
        branch_locations = JSON.parse(
          (formData.branch_locations as string) ?? "[]"
        );
      }

      const data = {
        constraint_name: formData.constraint_name,
        is_active: formData.is_active,
        constraint_type: formData.constraint_type,
        branch_ids: formData.branch_ids,
        branch_locations: branch_locations?.map((branch: any) => {
          return {
            branch_id: branch.branchId,
            name: branch.branchName,
            address: "branch.address",
            latitude: branch.latitude,
            longitude: branch.longitude,
            radius: Number(branch.radius ?? "1") <= 0 ? 1 : Number(branch.radius ?? "1"),
          };
        }),
        constraint_config: {
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
                          if (period && typeof period === 'object') {
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
                      } else if (typeof dayItem.periods === 'object' && dayItem.periods !== null) {
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

                // Add the day to the final object
                acc[day] = {
                  enabled: dayPeriods.length > 0,
                  total_work_hours: totalWorkHours,
                  periods: dayPeriods,
                };

                return acc;
              },
              {} as Record<string, any>
            ),
          },
        },
      };

      return await defaultSubmitHandler(
        data,
        getDynamicDeterminantFormConfig({ refetchConstraints }),
        {
          url: `${baseURL}/attendance/constraints`,
        }
      );
    },
    submitButtonText: "حفظ المحدد",
    cancelButtonText: "إلغاء",
  };
};
