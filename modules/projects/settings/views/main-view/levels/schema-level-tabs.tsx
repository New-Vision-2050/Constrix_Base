"use client";

import { Box, Grid, MenuItem, MenuList, Paper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { PRJ_ProjectType } from "@/types/api/projects/project-type";
import { useEffect, useState } from "react";
import AddSubProjectTypeDialog from "../../../components/dialogs/add-sub-project-type";
import { APP_ICONS } from "@/constants/icons";

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
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
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
                {schemas.map((schema) => {
                  const appIcon = APP_ICONS.find((i) => i.id === schema.icon);
                  const IconComponent = appIcon?.component;
                  return (
                    <MenuItem
                      selected={selectedSchemaId === schema.id}
                      onClick={() => onSelectSchema(schema)}
                      key={schema.id}
                      value={schema.id}
                      sx={{ px: 2, py: 1, borderRadius: 1 }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {IconComponent && <IconComponent size={18} />}
                        <Typography variant="subtitle1" fontWeight={500}>
                          {schema.name}
                        </Typography>
                      </Box>
                    </MenuItem>
                  );
                })}
                <MenuItem
                  onClick={() => setAddDialogOpen(true)}
                  sx={{ px: 2, py: 1, borderRadius: 1, color: "primary.main" }}
                >
                  <AddIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight={500}>
                    اضافة
                  </Typography>
                </MenuItem>
              </MenuList>
            </Paper>
          )}
          {parentId && (
            <AddSubProjectTypeDialog
              open={addDialogOpen}
              onClose={() => setAddDialogOpen(false)}
              onSuccess={() => refetch()}
              parentId={parentId}
            />
          )}
        </Grid>
        <Grid size={9}>{children}</Grid>
      </Grid>
    </div>
  );
}
