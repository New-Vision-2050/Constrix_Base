"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Paper from "@mui/material/Paper";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { TermServiceSettingsApi } from "@/services/api/crm-settings/term-service-settings";
import { LinearProgress } from "@mui/material";
import { ServiceItemAccordion } from "./ServiceItemAccordion";
import { AddServiceDialog } from "./AddServiceDialog";
import { EditServiceDialog } from "./EditServiceDialog";
import ConfirmDeleteDialog from "./CofirmDeleteDialog";
import type { TermServiceSettingItem } from "@/services/api/crm-settings/term-service-settings/types/response";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import Can from "@/lib/permissions/client/Can";

interface ServicesCardProps {
  projectTypeId: number | null;
}

export default function ServicesCard({ projectTypeId }: ServicesCardProps) {
  const t = useTranslations("CRMSettingsModule.servicesSettings");
  const { can } = usePermissions();

  const canEdit = can(PERMISSIONS.crm.serviceSettings.update);
  const canDelete = can(PERMISSIONS.crm.serviceSettings.delete);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<TermServiceSettingItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["term-service-settings", "all", projectTypeId],
    queryFn: async () => {
      const response = await TermServiceSettingsApi.List();
      return response.data.payload ?? [];
    },
    enabled: projectTypeId != null,
  });

  const payload = useMemo(() => data ?? [], [data]);

  const handleEdit = (item: TermServiceSettingItem) => {
    setEditItem(item);
    setEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4" data-project-type-id={projectTypeId}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("services")}</h2>
        <Button
          variant="default"
          size="lg"
          className="gap-2 px-8"
          onClick={() => setAddDialogOpen(true)}
        >
          {t("addService")}
        </Button>
      </div>

      <Paper className="w-full space-y-2 bg-card/50 p-4">
        {isLoading && <LinearProgress className="mb-2" />}
        {!isLoading && payload.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            {t("noServices")}
          </div>
        )}
        {!isLoading &&
          payload.map((item) => (
            <ServiceItemAccordion
              key={item.id}
              item={item}
              selectable={false}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={canEdit}
              canDelete={canDelete}
            />
          ))}
      </Paper>

      <Can
        check={[
          PERMISSIONS.crm.serviceSettings.create,
        ]}
      >
        <AddServiceDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onSuccess={() => {
            refetch();
            setAddDialogOpen(false);
          }}
          projectTypeId={projectTypeId ?? undefined}
          />
      </Can>
      <Can check={[
        PERMISSIONS.crm.serviceSettings.update,
      ]}> 
        <EditServiceDialog
          open={editDialogOpen}
          item={editItem}
          projectTypeId={projectTypeId ?? undefined}
          onClose={() => {
            setEditDialogOpen(false);
            setEditItem(null);
          }}
          onSuccess={() => {
            refetch();
            setEditDialogOpen(false);
            setEditItem(null);
          }}
        />
      </Can>
      <Can check={[
            PERMISSIONS.crm.serviceSettings.delete,
          ]}>
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        deleteId={deleteId}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteId(null);
        }}
        onSuccess={() => {
          refetch();
          setDeleteDialogOpen(false);
          setDeleteId(null);
        }}
      />
      </Can>
    </div>
  );
}
