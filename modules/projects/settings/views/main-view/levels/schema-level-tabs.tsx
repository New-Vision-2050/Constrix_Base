"use client";

import { Button, Tab, Tabs } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { PRJ_ProjectType } from "@/types/api/projects/project-type";
import LinearProgress from "@mui/material/LinearProgress";
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
  const { data, isLoading, isFetching } = useQuery({
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
    <div className="space-y-2">
      {(isLoading || isFetching) && <LinearProgress />}
      {showContent && (
        <>
          <Tabs
            value={selectedSchemaId ?? false}
            onChange={(_, value: number) => {
              const item = schemas.find((s) => s.id === value);
              if (item) onSelectSchema(item);
            }}
          >
            {schemas.map((schema) => (
              <Tab key={schema.id} label={schema.name} value={schema.id} />
            ))}
          </Tabs>
          <DialogTrigger
            component={AddProjectTypeDialog}
            dialogProps={{
              parentId: parentId,
              onSuccess: () => {},
            }}
            render={({ onOpen }) => (
              <Button variant="contained" color="primary" onClick={onOpen}>
                اضافة
              </Button>
            )}
          />
          {children}
        </>
      )}
    </div>
  );
}
