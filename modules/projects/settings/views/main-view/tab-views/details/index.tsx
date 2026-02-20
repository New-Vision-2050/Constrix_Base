import HorizontalSwitch from "@/modules/projects/settings/components/horizontal-switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { useEffect, useState } from "react";
import { UpdateDataSettingsArgs } from "@/services/api/projects/project-types/types/args";

const items = [
  {
    label: "الرقم المرجعي",
    value: "reference-number",
    apiKey: "is_reference_number" as keyof UpdateDataSettingsArgs,
  },
  {
    label: "اسم المشروع",
    value: "project-name",
    apiKey: "is_name_project" as keyof UpdateDataSettingsArgs,
  },
  {
    label: "المفصل",
    value: "detailed",
    apiKey: "is_client" as keyof UpdateDataSettingsArgs,
  },
  {
    label: "المهندس المسؤول",
    value: "responsible-engineer",
    apiKey: "is_responsible_engineer" as keyof UpdateDataSettingsArgs,
  },
  {
    label: "رقم العقد",
    value: "contract-number",
    apiKey: "is_number_contract" as keyof UpdateDataSettingsArgs,
  },
  {
    label: "مركز التكلفة",
    value: "cost-center",
    apiKey: "is_central_cost" as keyof UpdateDataSettingsArgs,
  },
  {
    label: "قيمة المشروع",
    value: "project-value",
    apiKey: "is_project_value" as keyof UpdateDataSettingsArgs,
  },
  {
    label: "تاريخ البدء",
    value: "start-date",
    apiKey: "is_start_date" as keyof UpdateDataSettingsArgs,
  },
  {
    label: "نسبة الانجاز",
    value: "completion-percentage",
    apiKey: "is_achievement_percentage" as keyof UpdateDataSettingsArgs,
  },
];

interface DetailsViewProps {
  projectTypeId: number | null;
}

function DetailsView({ projectTypeId }: DetailsViewProps) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["project-type-data-settings", projectTypeId],
    queryFn: async () => {
      if (!projectTypeId) return null;
      const response = await ProjectTypesApi.getDataSettings(projectTypeId);
      return response.data.payload;
    },
    enabled: projectTypeId !== null,
  });

  const updateMutation = useMutation({
    mutationFn: async (args: UpdateDataSettingsArgs) => {
      if (!projectTypeId) throw new Error("No project type ID");
      return ProjectTypesApi.updateDataSettings(projectTypeId, args);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-type-data-settings", projectTypeId],
      });
    },
  });

  const handleSwitchChange = (apiKey: keyof UpdateDataSettingsArgs, checked: boolean) => {
    updateMutation.mutate({
      [apiKey]: checked ? 1 : 0,
    });
  };

  if (!projectTypeId) {
    return <div className="w-full">الرجاء اختيار نوع مشروع</div>;
  }

  if (isLoading) {
    return <div className="w-full">جاري التحميل...</div>;
  }

  return (
    <div className="w-full">
      {items.map((item) => (
        <HorizontalSwitch
          key={item.value}
          checked={data?.[item.apiKey] ?? false}
          onChange={(checked) => handleSwitchChange(item.apiKey, checked)}
          label={item.label}
          disabled={updateMutation.isPending}
        />
      ))}
    </div>
  );
}

export default DetailsView;
