"use client";

import {
  Box,
  IconButton,
  LinearProgress,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { alpha } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import { PRJ_ProjectType } from "@/types/api/projects/project-type";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddProjectTypeDialog from "../../../../components/dialogs/add-project-type";
import EditProjectTypeDialog from "../../../../components/dialogs/edit-project-type";
import { APP_ICONS } from "@/constants/icons";
import SchemaLevelTabs from "./schema-level-tabs";
import { Settings } from "@mui/icons-material";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import OverflowTabBar from "@/components/shared/OverflowTabBar";
import { useIsRtl } from "@/hooks/use-is-rtl";

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
            component="span"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            color="primary"
            size="small"
            sx={{ cursor: "pointer", p: 0.25 }}
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
  const t = useTranslations("Projects.Settings.projectTypes");
  const isRtl = useIsRtl();
  const [selectedItem, setSelectedItem] = useState<PRJ_ProjectType | null>(
    null,
  );
  const [addDialogOpen, setAddDialogOpen] = useState(false);

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

  useEffect(() => {
    if (
      selectedItem &&
      items.length > 0 &&
      !items.some((item) => item.id === selectedItem.id)
    ) {
      setSelectedItem(items[0]);
    }
  }, [items, selectedItem]);

  const renderTabLabel = (item: PRJ_ProjectType) => {
    const appIcon = APP_ICONS.find((i) => i.id === item.icon);
    const IconComponent = appIcon?.component;

    return (
      <Box
        dir={isRtl ? "rtl" : "ltr"}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        {IconComponent ? <IconComponent size={16} /> : null}
        <span>{item.name}</span>
        <EditProjectTypeDialogTrigger
          item={item}
          parentId={parentId}
          onSuccess={() => refetch()}
        />
      </Box>
    );
  };

  return (
    <div className="space-y-4">
      {(isLoading || isFetching) && <LinearProgress />}
      {!isLoading && (
        <>
          <OverflowTabBar
            tabs={items}
            value={selectedItem?.id ?? items[0]?.id ?? 0}
            onChange={(id) => {
              const item = items.find((i) => i.id === id);
              if (item) setSelectedItem(item);
            }}
            renderLabel={(item) => renderTabLabel(item)}
            addLabel={t("add")}
            addActionWidth={52}
            overflowTriggerAriaLabel={t("add")}
            renderAddAction={(context) => (
              <Can check={[PERMISSIONS.projectType.create]}>
                {context === "menu" ? (
                  <MenuItem
                    onClick={() => setAddDialogOpen(true)}
                    sx={{
                      borderRadius: "10px",
                      mx: 0.75,
                      my: 0.25,
                      py: 1.25,
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.08),
                      "&:hover": {
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.14),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                      <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={t("add")}
                      primaryTypographyProps={{
                        fontWeight: 700,
                        color: "primary.main",
                        fontSize: "0.875rem",
                      }}
                    />
                  </MenuItem>
                ) : (
                  <IconButton
                    onClick={() => setAddDialogOpen(true)}
                    color="primary"
                    aria-label={t("add")}
                    sx={{ flexShrink: 0 }}
                  >
                    <AddIcon />
                  </IconButton>
                )}
              </Can>
            )}
          />

          <AddProjectTypeDialog
            open={addDialogOpen}
            onClose={() => setAddDialogOpen(false)}
            parentId={parentId}
            onSuccess={() => {
              void refetch();
              setAddDialogOpen(false);
            }}
          />

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
