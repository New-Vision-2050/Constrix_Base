import { FormConfig } from "@/modules/form-builder";
import { useEffect } from "react";
import { useFormStore } from "@/modules/form-builder/hooks/useFormStore";
import LocationDialog from "./LocationDialog/LocationDialog";

export const createDeterminantFormConfig: FormConfig = {
  formId: "create-determinant-form",
  title: "إضافة محدد جديد",
  sections: [
    {
      fields: [
        {
          type: "text",
          name: "name",
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
          name: "system",
          label: "نظام المحدد",
          placeholder: "منتظم",
          options: [
            { value: "regular", label: "منتظم" },
            { value: "flexible", label: "مرن" },
            { value: "shift", label: "شيفت" },
          ],
          required: true,
          validation: [
            {
              type: "required",
              message: "نظام المحدد مطلوب",
            },
          ],
        },
        {
          type: "select",
          isMulti: true,
          name: "branches",
          label: "الفروع",
          options: [
            { value: "riyadh", label: "فرع الرياض" },
            { value: "jeddah", label: "فرع جدة" },
          ],
          required: true,
          validation: [
            {
              type: "required",
              message: "يجب اختيار فرع واحد على الأقل",
            },
          ],
        },
        {
          type: "number",
          name: "attendance_tolerance",
          label: "مساحة الحضور",
          placeholder: "200",
          postfix: "متر",
          required: true,
          validation: [
            {
              type: "required",
              message: "مساحة الحضور مطلوبة",
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
          options: [
            { value: "sunday", label: "الأحد" },
            { value: "monday", label: "الاثنين" },
            { value: "tuesday", label: "الثلاثاء" },
            { value: "wednesday", label: "الأربعاء" },
            { value: "thursday", label: "الخميس" },
            { value: "friday", label: "الجمعة" },
            { value: "saturday", label: "السبت" },
          ],
          defaultValue: ["sunday"],
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
  ],
  submitButtonText: "التالي",
  cancelButtonText: "إلغاء",
};
