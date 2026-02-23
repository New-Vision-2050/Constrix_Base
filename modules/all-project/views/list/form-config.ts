import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

export function getAddProjectFormConfig(): FormConfig {
  return {
    formId: "add-project-form",
    title: "اضافة مشروع",
    apiUrl: `${baseURL}/projects`,
    editApiUrl: `${baseURL}/projects/:id`,
    editApiMethod: "PUT",
    editDataPath: "payload",
    editDataTransformer: (data: Record<string, unknown>) => {
      const clientId = data.client_id ?? (data.client as { id?: number })?.id;
      const ownerType = clientId ? "entity" : "individual";
      return {
        ...data,
        project_type_id: (data.project_type as { id?: number })?.id ?? data.project_type_id,
        sub_project_type_id: (data.sub_project_type as { id?: number })?.id ?? data.sub_project_type_id,
        sub_sub_project_type_id: (data.sub_sub_project_type as { id?: number })?.id ?? data.sub_sub_project_type_id,
        cost_center_branch_id: (data.cost_center_branch as { id?: number })?.id ?? data.cost_center_branch_id,
        management_id: (data.management as { id?: number })?.id ?? data.management_id,
        responsible_employee_id: (data.responsible_employee as { id?: number })?.id ?? data.responsible_employee_id,
        owner_type: ownerType,
        client_id_entity: ownerType === "entity" ? clientId : undefined,
        client_id_individual: ownerType === "individual" ? clientId : undefined,
      };
    },
    laravelValidation: { enabled: true, errorsPath: "errors" },
    sections: [
      {
        collapsible: false,
        fields: [
          // ── Row 1: Project type (root) ─────────────────────────────────
          {
            name: "project_type_id",
            label: "نوع المشروع",
            type: "select",
            placeholder: "نوع المشروع",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/project-types/roots`,
              valueField: "id",
              labelField: "name",
            },
          },

          // ── Row 2: Sub type (depends on project_type_id) ───────────────
          {
            name: "sub_project_type_id",
            label: "تصنيف المشروع",
            type: "select",
            placeholder: "تصنيف المشروع",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/project-types/{project_type_id}/children`,
              valueField: "id",
              labelField: "name",
              dependsOn: {
                project_type_id: { method: "replace" },
              },
            },
          },

          // ── Row 3: Sub-sub type (depends on sub_project_type_id) ───────
          {
            name: "sub_sub_project_type_id",
            label: "التصنيف الفرعي للمشروع",
            type: "select",
            placeholder: "التصنيف الفرعي للمشروع",
            dynamicOptions: {
              url: `${baseURL}/project-types/{sub_project_type_id}/children`,
              valueField: "id",
              labelField: "name",
              dependsOn: {
                sub_project_type_id: { method: "replace" },
              },
            },
          },

          // ── Row 4: Project name ────────────────────────────────────────
          {
            name: "name",
            label: "اسم المشروع",
            type: "text",
            placeholder: "اسم المشروع",
            required: true,
          },

          // ── Row 5: Branch ──────────────────────────────────────────────
          {
            name: "cost_center_branch_id",
            label: "اسم الفرع لتابع له المشروع",
            type: "select",
            placeholder: "اسم الفرع لتابع له المشروع",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/branches`,
              valueField: "id",
              labelField: "name",
            },
          },

          // ── Row 6: Management ──────────────────────────────────────────
          {
            name: "management_id",
            label: "الادارة لتابع له المشروع",
            type: "select",
            placeholder: "الادارة لتابع له المشروع",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/managements`,
              valueField: "id",
              labelField: "name",
            },
          },

          // ── Row 7: Management director (depends on management_id) ──────
          {
            name: "management_director_id",
            label: "مدير الادارة",
            type: "select",
            placeholder: "مدير الادارة",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/managements/{management_id}/director`,
              valueField: "id",
              labelField: "name",
              dependsOn: {
                management_id: { method: "replace" },
              },
            },
          },

          // ── Row 8: Project manager ─────────────────────────────────────
          {
            name: "responsible_employee_id",
            label: "مدير المشروع",
            type: "select",
            placeholder: "مدير المشروع",
            dynamicOptions: {
              url: `${baseURL}/company-users`,
              valueField: "id",
              labelField: "name",
            },
          },

          // ── Row 9: Owner type (radio) ──────────────────────────────────
          {
            name: "owner_type",
            label: "مالك المشروع",
            type: "radio",
            required: true,
            options: [
              { value: "entity", label: "جهة" },
              { value: "individual", label: "فرد" },
            ],
          },

          // ── Row 10a: Client dropdown — entity (/companies/clients) ─────
          {
            name: "client_id_entity",
            label: "اختار العميل",
            type: "select",
            placeholder: "اختار العميل",
            required: true,
            condition: (values) => values.owner_type === "entity",
            dynamicOptions: {
              url: `${baseURL}/companies/clients`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
            },
          },

          // ── Row 10b: Client dropdown — individual (/company-users/clients)
          {
            name: "client_id_individual",
            label: "اختار العميل",
            type: "select",
            placeholder: "اختار العميل",
            required: true,
            condition: (values) => values.owner_type === "individual",
            dynamicOptions: {
              url: `${baseURL}/company-users/clients`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
            },
          },

          // ── Row 11: Contractual relationship ──────────────────────────
          {
            name: "contract_type_id",
            label: "الارتباط التعاقدي",
            type: "select",
            placeholder: "الارتباط التعاقدي",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/contract-types`,
              valueField: "id",
              labelField: "name",
            },
          },

          // ── Row 12: Project tag/classification ────────────────────────
          {
            name: "project_classification_id",
            label: "وسم المشروع",
            type: "select",
            placeholder: "وسم المشروع",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/project-classifications`,
              valueField: "id",
              labelField: "name",
            },
          },
        ],
      },
    ],
    submitButtonText: "حفظ",
    showReset: false,
    showCancelButton: false,
    showBackButton: false,
    showSubmitLoader: true,
    resetOnSuccess: true,
    onSubmit: async (formData, formConfig) => {
      const clientId =
        formData.owner_type === "entity"
          ? formData.client_id_entity
          : formData.client_id_individual;

      const payload = {
        project_type_id: formData.project_type_id,
        sub_project_type_id: formData.sub_project_type_id,
        sub_sub_project_type_id: formData.sub_sub_project_type_id,
        name: formData.name,
        responsible_employee_id: formData.responsible_employee_id,
        client_id: clientId,
        project_classification_id: formData.project_classification_id,
        cost_center_branch_id: formData.cost_center_branch_id,
        management_id: formData.management_id,
        status: 1,
      };

      return defaultSubmitHandler(payload, formConfig);
    },
  };
}
