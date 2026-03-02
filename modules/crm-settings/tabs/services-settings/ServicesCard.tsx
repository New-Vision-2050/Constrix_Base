"use client";

import { useMemo, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import Paper from "@mui/material/Paper";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { TermServiceSettingsApi } from "@/services/api/crm-settings/term-service-settings";
import type {
  TermServiceSettingChild,
  TermServiceSettingItem,
} from "@/services/api/crm-settings/term-service-settings/types/response";
import { LinearProgress } from "@mui/material";
import { ServiceItemAccordion } from "./components/ServiceItemAccordion";
import { AddServiceDialog } from "./components/AddServiceDialog";

interface ServicesCardProps {
  projectTypeId: number | null;
}

function getAllDescendantIds(
  item: TermServiceSettingItem | TermServiceSettingChild,
): number[] {
  const ids: number[] = [];
  const collect = (i: TermServiceSettingItem | TermServiceSettingChild) => {
    ids.push(i.id);
    (i.children || []).forEach(collect);
  };
  collect(item);
  return ids;
}

function findItemById(
  items: (TermServiceSettingItem | TermServiceSettingChild)[],
  targetId: number,
  parent: TermServiceSettingItem | TermServiceSettingChild | null = null,
): {
  item: TermServiceSettingItem | TermServiceSettingChild;
  parent: TermServiceSettingItem | TermServiceSettingChild | null;
} | null {
  for (const item of items) {
    if (item.id === targetId) return { item, parent };
    const found = findItemById(item.children || [], targetId, item);
    if (found) return found;
  }
  return null;
}

export default function ServicesCard({ projectTypeId }: ServicesCardProps) {
  const t = useTranslations("CRMSettingsModule.servicesSettings");

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["term-service-settings", "all", projectTypeId],
    queryFn: async () => {
      const response = await TermServiceSettingsApi.List();
      return response.data.payload ?? [];
    },
    enabled: projectTypeId != null,
  });

  const payload = useMemo(() => data ?? [], [data]);

  const handleToggle = useCallback(
    (id: number, checked: boolean, parentId?: number) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (checked) next.add(id);
        else next.delete(id);

        // When a child is checked: add parent(s) if all their descendants are now selected
        if (checked && parentId != null) {
          let currentParentId: number | undefined = parentId;
          while (currentParentId != null) {
            const found = findItemById(payload, currentParentId);
            if (!found) break;
            const { item: parentItem } = found;
            const descendantIds = getAllDescendantIds(parentItem);
            const allDescendantsSelected = descendantIds
              .filter((did) => did !== parentItem.id)
              .every((did) => next.has(did));
            if (allDescendantsSelected) {
              next.add(parentItem.id);
              const parentOfParent = findItemById(payload, parentItem.id);
              currentParentId = parentOfParent?.parent?.id;
            } else {
              break;
            }
          }
        }

        // When a child is unchecked: remove parent(s) from selection
        if (!checked && parentId != null) {
          let currentParentId: number | undefined = parentId;
          while (currentParentId != null) {
            next.delete(currentParentId);
            const found = findItemById(payload, currentParentId);
            currentParentId = found?.parent?.id;
          }
        }

        return next;
      });
    },
    [payload],
  );

  const handleToggleWithDescendants = useCallback(
    (ids: number[], checked: boolean) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => {
          if (checked) next.add(id);
          else next.delete(id);
        });
        return next;
      });
    },
    [],
  );

  const handleEdit = useCallback((id: number) => {
    // TODO: Open edit dialog for service item
    void id;
  }, []);

  const handleDelete = useCallback((id: number) => {
    // TODO: Show delete confirmation and delete service item
    void id;
  }, []);

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
              selectedIds={selectedIds}
              onToggle={handleToggle}
              onToggleWithDescendants={handleToggleWithDescendants}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
      </Paper>

      <AddServiceDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={() => {
          refetch();
          setAddDialogOpen(false);
        }}
        projectTypeId={projectTypeId}
      />
    </div>
  );
}
