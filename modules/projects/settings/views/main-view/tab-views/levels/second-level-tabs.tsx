"use client";

import { Box, Paper, Tab, Tabs, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { PRJ_ProjectType } from "@/types/api/projects/project-type";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useMemo, useState } from "react";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddProjectTypeDialog from "../../../../components/dialogs/add-project-type";
import EditProjectTypeDialog from "../../../../components/dialogs/edit-project-type";
import { APP_ICONS } from "@/constants/icons";
import SchemaLevelTabs from "./schema-level-tabs";
import { Settings } from "@mui/icons-material";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

interface SecondLevelTabsProps {
  parentId: number;
}

function EditProjectTypeDialogTrigger({
  item,
  parentId,
  onSuccess,
}: {
  item: PRJ_ProjectType;
  parentId: number;
  onSuccess: () => void;
}) {
  return (
    <Can check={[PERMISSIONS.projectType.update]}>
      <DialogTrigger
        component={EditProjectTypeDialog}
        dialogProps={{
          parentId,
          projectType: item,
          onSuccess,
        }}
        render={({ onOpen }) => (
          <IconButton
            component="div"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            color="primary"
            sx={{ cursor: "pointer" }}
          >
            <Settings
              sx={{ fontSize: 20 }}
              className="text-gray-500 cursor-pointer"
            />
          </IconButton>
        )}
      />
    </Can>
  );
}

export default function SecondLevelTabs({ parentId }: SecondLevelTabsProps) {
  const [selectedItem, setSelectedItem] = useState<PRJ_ProjectType | null>(
    null,
  );

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["project-types", "children", parentId],
    queryFn: async () => {
      const response = await ProjectTypesApi.getDirectChildren(parentId);
      return response.data.payload ?? [];
    },
  });

  const items = useMemo(() => data ?? [], [data]);

  useEffect(() => {
    if (items.length > 0 && !selectedItem) {
      setSelectedItem(items[0]);
    }
  }, [items, selectedItem]);

  return (
    <div className="space-y-4">
      {(isLoading || isFetching) && <LinearProgress />}
      {!isLoading && (
        <>
          <Paper>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tabs
                value={selectedItem?.id ?? false}
                onChange={(_, value: number) => {
                  const item = items.find((i) => i.id === value);
                  if (item) setSelectedItem(item);
                }}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ flex: 1, minWidth: 0 }}
              >
                {items.map((item) => {
                  const appIcon = APP_ICONS.find((i) => i.id === item.icon);
                  const IconComponent = appIcon?.component;
                  return (
                    <Tab
                      key={item.id}
                      value={item.id}
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                          }}
                        >
                          {IconComponent && <IconComponent size={16} />}
                          {item.name}
                          <Can check={[PERMISSIONS.projectType.update]}>
                            <EditProjectTypeDialogTrigger
                              item={item}
                              parentId={parentId}
                              onSuccess={() => refetch()}
                            />
                          </Can>
                        </Box>
                      }
                    />
                  );
                })}
              </Tabs>
              <Box sx={{ flexShrink: 0 }}>
                <Can check={[PERMISSIONS.projectType.create]}>
                  <DialogTrigger
                    component={AddProjectTypeDialog}
                    dialogProps={{
                      parentId,
                      onSuccess: () => refetch(),
                    }}
                    render={({ onOpen }) => (
                      <IconButton
                        onClick={onOpen}
                        sx={{ mr: 1 }}
                        color="primary"
                      >
                        <AddIcon />
                      </IconButton>
                    )}
                  />
                </Can>
              </Box>
            </div>
          </Paper>
          {selectedItem && (
            <Can check={[PERMISSIONS.projectType.view]}>
              <SchemaLevelTabs
                key={selectedItem.id}
                firstLevelId={parentId}
                parentId={selectedItem.id}
              />
            </Can>
          )}
        </>
      )}
    </div>
  );
}
