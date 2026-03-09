import HorizontalSwitch from "@/modules/projects/settings/components/horizontal-switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { UpdateDataSettingsArgs } from "@/services/api/projects/project-types/types/args";
import { SettingsTabItemProps } from "../../types";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const accordionSx = {
  "&:before": { display: "none" },
  boxShadow: "none",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 2,
  "&.Mui-expanded": { margin: 0 },
};

const sections = [
  {
    title: "الجدول الرئيسي",
    items: [
      { label: "الرقم المرجعي", apiKey: "is_reference_number" as keyof UpdateDataSettingsArgs },
      { label: "رقم العقد", apiKey: "is_number_contract" as keyof UpdateDataSettingsArgs },
      { label: "مركز التكلفة", apiKey: "is_central_cost" as keyof UpdateDataSettingsArgs },
    ],
  },
  {
    title: "جدول البيانات",
    items: [
      { label: "اسم المشروع", apiKey: "is_name_project" as keyof UpdateDataSettingsArgs },
      { label: "تاريخ البدء", apiKey: "is_start_date" as keyof UpdateDataSettingsArgs },
      { label: "قيمة المشروع", apiKey: "is_project_value" as keyof UpdateDataSettingsArgs },
    ],
  },
  {
    title: "جدول العميل",
    items: [
      { label: "نسبة الانجاز", apiKey: "is_achievement_percentage" as keyof UpdateDataSettingsArgs },
      { label: "المفصل", apiKey: "is_client" as keyof UpdateDataSettingsArgs },
      { label: "المهندس المسؤول", apiKey: "is_responsible_engineer" as keyof UpdateDataSettingsArgs },
    ],
  },
];

function DetailsView({ thirdLevelId: projectTypeId }: SettingsTabItemProps) {
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

  const handleSwitchChange = (
    apiKey: keyof UpdateDataSettingsArgs,
    checked: boolean,
  ) => {
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
      <Accordion defaultExpanded sx={accordionSx}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            "& .MuiAccordionSummary-content": {
              alignItems: "center",
            },
          }}
        >
          <Typography variant="body1" fontWeight={600}>
            البيانات الرئيسية
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {sections.map((section) => (
              <Grid size={{ xs: 12, md: 4 }} key={section.title}>
                <Accordion defaultExpanded sx={accordionSx}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      "& .MuiAccordionSummary-content": {
                        alignItems: "center",
                      },
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {section.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      {section.items.map((item) => (
                        <HorizontalSwitch
                          key={item.apiKey}
                          checked={data?.[item.apiKey] ?? false}
                          onChange={(checked) => handleSwitchChange(item.apiKey, checked)}
                          label={item.label}
                          disabled={updateMutation.isPending}
                        />
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default DetailsView;
