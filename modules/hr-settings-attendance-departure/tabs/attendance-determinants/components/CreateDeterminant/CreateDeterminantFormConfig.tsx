import { FormConfig } from "@/modules/form-builder";
import { useEffect } from "react";
import { useFormStore } from "@/modules/form-builder/hooks/useFormStore";
import LocationDialog from "./LocationDialog/LocationDialog";
import { baseURL } from "@/config/axios-config";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

// Day names mapping
const dayNames = {
  sunday: "الأحد",
  monday: "الاثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء",
  thursday: "الخميس",
  friday: "الجمعة",
  saturday: "السبت",
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

export const createDeterminantFormConfig: FormConfig = {
  formId: "create-determinant-form",
  title: "إضافة محدد جديد",
  wizard: true,
  apiUrl: `${baseURL}/attendance/constraints`,
  // wizardOptions: {
  //   // showStepIndicator: true,
  //   // showStepTitles: true,
  //   validateStepBeforeNext: true,
  //   nextButtonText: "التالي",
  //   prevButtonText: "السابق",
  //   finishButtonText: "حفظ المحدد",
  //    // Enable submitting each step individually
  //    submitEachStep: true,
  //    submitButtonTextPerStep: "التالي",
  //    // API URLs for each step
  //    stepApiUrls: {
  //      0: `${baseURL}/attendance/constraints`,
  //      1: `${baseURL}/attendance/constraints`,
  //    },
  //    // API headers for each step
  //    stepApiHeaders: {
  //      0: {
  //        "X-Location-API-Key": "location-api-key",
  //      },
  //      1: {
  //        "X-User-API-Key": "user-api-key",
  //      },
  //    },
  //   onStepChange: (prevStep, nextStep, values) => {
  //     // When moving from step 0 (basic info) to step 1, create day sections
  //     if (prevStep === 0 && nextStep === 1 && values.working_days) {
  //       // This will trigger re-render with new sections
  //       console.log("Creating sections for days:", values.working_days);
  //     }
  //   },
  //   onStepSubmit: async (step, values) => {
  //     console.log("Step submission", step, values);

  //     // Result of the API call (for now simulated)
  //     const result = {
  //       success: true,
  //       message: "Form submitted successfully",
  //       data: values,
  //     };

  //     // If submission was successful, manually trigger navigation to next step
  //     if (result.success) {
  //       // Get a reference to the form hooks from somewhere else instead of modifying here
  //       // The form builder's internal goToNextStep will be called by returning success
  //       console.log("Step submission successful, form should advance");
  //     }

  //     return result;
  //   },
  // },
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
          type: "checkboxGroup",
          name: "working_days",
          label: "أيام الحضور",
          isMulti: true,
          options: [
            { value: "sunday", label: "الأحد" },
            { value: "monday", label: "الاثنين" },
            { value: "tuesday", label: "الثلاثاء" },
            { value: "wednesday", label: "الأربعاء" },
            { value: "thursday", label: "الخميس" },
            { value: "friday", label: "الجمعة" },
            { value: "saturday", label: "السبت" },
          ],
          required: true,
          validation: [
            {
              type: "required",
              message: "يجب اختيار يوم واحد على الأقل",
            },
          ],
        },
      ],
    },
    // Day sections will be added dynamically based on working_days selection
  ],
  onSubmit: async (formData: Record<string, unknown>) => {
    // prepare data for submission
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
        console.log("branch909", branch);
        return {
          branch_id: branch.branchId,
          name: branch.branchName,
          address: "branch.address",
          latitude: branch.latitude,
          longitude: branch.longitude,
          radius: Number(branch.radius ?? "0"),
        };
      }),
      // "constraint_config"
    };
    console.log("Form data received:", data, formData);

    return await defaultSubmitHandler(data, createDeterminantFormConfig, {
      url: `${baseURL}/attendance/constraints`,
    });
  },
  submitButtonText: "حفظ المحدد",
  cancelButtonText: "إلغاء",
};

// Function to get form config with dynamic day sections
export const getDynamicDeterminantFormConfig = (
  workingDays: string[] = ["sunday"]
): FormConfig => {
  const baseConfig = { ...createDeterminantFormConfig };

  // Add day sections based on selected working days
  const daySections = createDaySections(workingDays);

  return {
    ...baseConfig,
    sections: [...baseConfig.sections, ...daySections],
  };
};
