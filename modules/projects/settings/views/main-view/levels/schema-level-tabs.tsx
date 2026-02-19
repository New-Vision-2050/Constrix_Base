"use client";

import { Grid, MenuItem, MenuList, Paper, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { PRJ_ProjectType } from "@/types/api/projects/project-type";
import { useEffect } from "react";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddProjectTypeDialog from "../../../components/dialogs/add-project-type";

interface SchemaLevelTabsProps {
  parentId: number | null;
  selectedSchemaId: number | null;
  onSelectSchema: (item: PRJ_ProjectType) => void;
  children: React.ReactNode;
}

export default function SchemaLevelTabs({
  parentId,
  selectedSchemaId,
  onSelectSchema,
  children,
}: SchemaLevelTabsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["project-types", "schemas", parentId],
    queryFn: async () => {
      if (!parentId) return [];
      const response = await ProjectTypesApi.getProjectTypeSchemas(parentId);
      return response.data.payload ?? [];
    },
    enabled: parentId !== null,
  });

  const schemas = data ?? [];

  useEffect(() => {
    if (schemas.length > 0 && !selectedSchemaId) {
      onSelectSchema(schemas[0]);
    }
  }, [schemas, selectedSchemaId, onSelectSchema]);

  const showContent = !parentId || !isLoading;

  return (
    <div className="space-y-4">
      <Grid container spacing={2}>
        <Grid size={3}>
          {showContent && (
            <Paper>
              <MenuList>
                {schemas.map((schema) => (
                  <MenuItem
                    selected={selectedSchemaId === schema.id}
                    onClick={() => onSelectSchema(schema)}
                    key={schema.id}
                    value={schema.id}
                    sx={{ px: 2, py: 1, borderRadius: 1 }}
                  >
                    <Typography variant="subtitle1" fontWeight={500}>
                      {schema.name}
                    </Typography>
                  </MenuItem>
                ))}
                <DialogTrigger
                  component={AddProjectTypeDialog}
                  dialogProps={{
                    parentId: parentId ?? 0,
                    onSuccess: () => {},
                  }}
                  render={({ onOpen }) => (
                    <MenuItem
                      onClick={onOpen}
                      sx={{ px: 2, py: 1, borderRadius: 1 }}
                    >
                      <Typography variant="subtitle1" fontWeight={500}>
                        اضافة
                      </Typography>
                    </MenuItem>
                  )}
                />
              </MenuList>
            </Paper>
          )}
        </Grid>
        <Grid size={9}>{children}</Grid>
      </Grid>
    </div>
  );
}
