import { FormConfig } from "@/modules/form-builder";
import { useEffect, useMemo } from "react";
import { useFormStore } from "@/modules/form-builder/hooks/useFormStore";
import LocationDialog from "./LocationDialog/LocationDialog";
import { baseURL } from "@/config/axios-config";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useAttendanceDeterminants } from "../../context/AttendanceDeterminantsContext";

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

// الرسائل التي سيتم عرضها في النموذج
const messages = {
  addDay: "أضافة يوم عمل",
  addPeriod: "أضافة فترة عمل",
  duplicateDay: "تم اختيار هذا اليوم مسبقاً",
};

// Function to create day-specific sections dynamically
const createDaySections = (workingDays: string[]) => {
  return workingDays.map((day) => ({
    title: `إعدادات ${dayNames[day as keyof typeof dayNames]}`,
    fields: [
      {
        type: "text" as const,
        name: `${day}_start_time`,
        label: "وقت بداية العمل",
        placeholder: "09:00",
        required: true,
        validation: [
          {
            type: "required" as const,
            message: "وقت بداية العمل مطلوب",
          },
        ],
      },
      {
        type: "text" as const,
        name: `${day}_end_time`,
        label: "وقت نهاية العمل",
        placeholder: "17:00",
        required: true,
        validation: [
          {
            type: "required" as const,
            message: "وقت نهاية العمل مطلوب",
          },
        ],
      },
      {
        type: "text" as const,
        name: `${day}_break_start`,
        label: "بداية فترة الراحة (اختياري)",
        placeholder: "12:00",
      },
      {
        type: "text" as const,
        name: `${day}_break_end`,
        label: "نهاية فترة الراحة (اختياري)",
        placeholder: "13:00",
      },
    ],
  }));
};

type PropsT = {
  refetchConstraints: () => void;
};
export const createDeterminantFormConfig = ({ refetchConstraints }: PropsT) => {
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
    onSubmit: async (formData: Record<string, unknown>) => {
      // التحقق من وجود أيام مكررة في جدول العمل
      if (formData.weekly_schedule && Array.isArray(formData.weekly_schedule)) {
        const weeklySchedule = formData.weekly_schedule as Array<any>;
        const days = weeklySchedule.map((item) => item.day);

        // البحث عن الأيام المكررة
        const uniqueDays = new Set(days);
        if (uniqueDays.size !== days.length) {
          // إذا وجدت أيام مكررة، إرجاع خطأ
          return {
            success: false,
            message: messages.duplicateDay || "تم اختيار هذا اليوم مسبقاً",
          };
        }

        // تنسيق بيانات جدول العمل للإرسال
        const formattedSchedule = weeklySchedule.map((dayItem) => {
          // التعامل مع حالة dayItem.periods دائماً بأمان
          let periodsArray = [];

          try {
            if (dayItem.periods) {
              if (Array.isArray(dayItem.periods)) {
                // إذا كانت مصفوفة
                periodsArray = dayItem.periods.map((period: any) => {
                  // للتأكد من أن period هو كائن
                  if (period && typeof period === "object") {
                    return {
                      from: String(period.from || ""),
                      to: String(period.to || ""),
                    };
                  } else {
                    // إذا لم يكن period كائنًا
                    return { from: "", to: "" };
                  }
                });
              } else if (
                typeof dayItem.periods === "object" &&
                dayItem.periods !== null
              ) {
                // إذا كانت كائن وليست مصفوفة
                const period = dayItem.periods;
                periodsArray = [
                  {
                    from: String(period.from || ""),
                    to: String(period.to || ""),
                  },
                ];
              }
            }
          } catch (error) {
            console.error("Error processing periods:", error, dayItem);
          }

          return {
            day: dayItem.day,
            periods: periodsArray,
          };
        });

        // تحديث البيانات بالجدول المنسق
        formData.formatted_schedule = formattedSchedule;
      }

      // تجهيز بيانات المواقع
      const branch_locations =
        formData.location_type === "custom"
          ? JSON.parse((formData.branch_locations as string) ?? "[]")
          : [];

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
            radius: Number(branch.radius ?? "0"),
          };
        }),
        constraint_config: {
          time_rules: {
            subtype: "multiple_periods",
            weekly_schedule: Object.keys(dayNames).reduce<Record<string, any>>(
              (acc, day) => {
                // طباعة معلومات تصحيحية لفهم شكل البيانات
                const daySchedules = Array.isArray(formData.formatted_schedule)
                  ? formData.formatted_schedule.filter(
                      (period: any) => period.day === day
                    )
                  : [];

                // جمع ساعات العمل لليوم
                let dayPeriods: any[] = [];

                // تجميع جميع فترات العمل لهذا اليوم
                daySchedules.forEach((dayItem: any) => {
                  if (Array.isArray(dayItem.periods)) {
                    dayItem.periods.forEach((period: any) => {
                      // التحقق من الحقول المطلوبة

                      // التحقق من الاسم الصحيح للحقل
                      const startTime = period.from || "";
                      const endTime = period.to || "";

                      if (startTime && endTime) {
                        dayPeriods.push({
                          start_time: startTime,
                          end_time: endTime,
                        });
                      }
                    });
                  }
                });

                let totalWorkHours = 0;

                dayPeriods.forEach((period) => {
                  try {
                    // تحويل الأوقات إلى دقائق
                    const [startHour, startMinute] = period.start_time
                      .split(":")
                      .map(Number);
                    const [endHour, endMinute] = period.end_time
                      .split(":")
                      .map(Number);

                    // حساب الفرق بالدقائق
                    const startTotalMinutes =
                      startHour * 60 + (startMinute || 0);
                    const endTotalMinutes = endHour * 60 + (endMinute || 0);
                    let diffMinutes = endTotalMinutes - startTotalMinutes;

                    // إذا كانت النهاية قبل البداية، نفترض أنها تعدى منتصف الليل
                    if (diffMinutes < 0) {
                      diffMinutes += 24 * 60; // إضافة 24 ساعة
                    }

                    // تحويل الدقائق إلى ساعات
                    const hours = diffMinutes / 60;
                    totalWorkHours += hours;
                  } catch (e) {
                    console.error("Error calculating hours:", e, period);
                  }
                });

                // تقريب إلى رقمين عشريين
                totalWorkHours = Math.round(totalWorkHours * 100) / 100;

                // إضافة اليوم إلى الكائن النهائي
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

      return await defaultSubmitHandler(data, createDeterminantFormConfig, {
        url: `${baseURL}/attendance/constraints`,
      });
    },
    submitButtonText: "حفظ المحدد",
    cancelButtonText: "إلغاء",
  };
};

// Function to get form config with dynamic day sections
export const getDynamicDeterminantFormConfig = (
  workingDays: string[] = ["sunday"]
): FormConfig => {
  const { refetchConstraints } = useAttendanceDeterminants();
  const _config = useMemo(() => createDeterminantFormConfig({ refetchConstraints }), []);
  const baseConfig = { ..._config };

  // Add day sections based on selected working days
  const daySections = createDaySections(workingDays);

  return {
    ...baseConfig,
    sections: [...baseConfig.sections, ...daySections],
  };
};
