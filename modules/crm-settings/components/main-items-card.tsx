"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import HeadlessTableLayout from "@/components/headless/table";
import { ProjectTermsApi } from "@/services/api/projects/project-terms";
import { TermSetting } from "@/services/api/projects/project-terms/types/response";
import { AddProjectTermDialog } from "./AddProjectTermDialog";
import { EditProjectTermDialog } from "./EditProjectTermDialog";
import { ItemActionsDialog } from "./ItemActionsDialog";
import ConfirmDeleteDialog from "@/modules/company-profile/components/official-data/official-docs-section/docs-settings-dialog/AddDocumentType/ConfirmDeleteDialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const TermSettingsTable = HeadlessTableLayout<TermSetting>("term-settings");

interface ProjectTermsViewProps {
  projectTypeId: number | null;
}

interface RowActionsProps {
  row: TermSetting;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  t: any;
}

function RowActions({ row, onEdit, onDelete, onView, t }: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          {t('table.actions')}
          <ChevronDown className="h-4 w-4 mr-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView(row.id)}>
          {t('actions.view')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(row.id)}>
          {t('actions.edit')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(row.id)} className="text-destructive">
          {t('actions.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ServicesDropdownProps {
  termSetting: TermSetting;
  allServices: Array<{ id: number; name: string }>;
  onUpdate: () => void;
  t: any;
}

function ServicesDropdown({ termSetting, allServices, onUpdate, t }: ServicesDropdownProps) {
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>(
    termSetting.services?.map(s => s.id) || []
  );
  const [isUpdating, setIsUpdating] = useState(false);

  // Update local state when termSetting changes
  React.useEffect(() => {
    setSelectedServiceIds(termSetting.services?.map(s => s.id) || []);
  }, [termSetting.services]);

  const handleToggleService = async (serviceId: number, checked: boolean) => {
    const newSelectedIds = checked
      ? [...selectedServiceIds, serviceId]
      : selectedServiceIds.filter(id => id !== serviceId);

    setSelectedServiceIds(newSelectedIds);
    setIsUpdating(true);

    try {
      await ProjectTermsApi.updateTermServices(termSetting.id, {
        term_service_ids: newSelectedIds,
      });
      toast.success(t('success.servicesUpdated'));
      onUpdate();
    } catch (error) {
      console.error("Error updating services:", error);
      toast.error(t('error.servicesUpdateFailed'));
      // Revert on error
      setSelectedServiceIds(termSetting.services?.map(s => s.id) || []);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8" disabled={isUpdating}>
          {t('actions.selectServices')}
          <ChevronDown className="h-4 w-4 mr-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56" dir="rtl">
        {allServices.map((service) => (
          <DropdownMenuCheckboxItem
            key={service.id}
            checked={selectedServiceIds.includes(service.id)}
            onCheckedChange={(checked) => handleToggleService(service.id, checked)}
            disabled={isUpdating}
            className="cursor-pointer flex-row-reverse justify-between [&>span]:data-[state=checked]:bg-pink-500 [&>span]:data-[state=checked]:border-pink-500"
          >
            {service.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProjectTermsView({ projectTypeId }: ProjectTermsViewProps) {
  const t = useTranslations('CRMSettingsModule.terms');
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingTermId, setEditingTermId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [itemActionsDialogOpen, setItemActionsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TermSetting | null>(null);

  // Table params
  const params = TermSettingsTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  // Fetch term settings
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["term-settings", projectTypeId, params.page, params.limit, params.search],
    queryFn: async () => {
      const response = await ProjectTermsApi.getTermSettings({
        page: params.page,
        per_page: params.limit,
        name: params.search || undefined,
      });
      return response.data;
    },
    enabled: !!projectTypeId,
  });

  const termSettings = useMemo<TermSetting[]>(
    () => (data?.payload || []),
    [data]
  );

  const totalPages = useMemo(() => data?.pagination?.last_page || 1, [data]);
  const totalItems = useMemo(() => data?.pagination?.result_count || 0, [data]);

  // Fetch term services for dropdown
  const { data: termServicesData } = useQuery({
    queryKey: ["term-services"],
    queryFn: async () => {
      const response = await ProjectTermsApi.getTermServices({
        page: 1,
        per_page: 100,
      });
      return response.data;
    },
  });

  const allServices = termServicesData?.payload || [];

  // Handlers
  const handleDeleteClick = (id: number) => {
    setDeleteConfirmId(id);
  };

  const handleViewClick = (id: number) => {
    const item = termSettings.find(t => t.id === id);
    if (item) {
      setSelectedItem(item);
      setItemActionsDialogOpen(true);
    }
  };

  const handleNameClick = (row: TermSetting) => {
    setSelectedItem(row);
    setItemActionsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await ProjectTermsApi.deleteTermSetting(deleteConfirmId);
      toast.success(t('success.deleted'));
      setDeleteConfirmId(null);
      refetch();
    } catch {
      toast.error(t('error.deleteFailed'));
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleToggleActive = async (id: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    
    try {
      await ProjectTermsApi.updateTermStatus(id, {
        is_active: newStatus,
      });
      toast.success(newStatus === 1 ? t('success.statusActivated') : t('success.statusDeactivated'));
      refetch();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(t('error.statusUpdateFailed'));
    }
  };

  // Define table columns matching Figma design
  const columns = [
    {
      key: "id",
      name: t('table.referenceNumber'),
      sortable: true,
      render: (row: TermSetting) => (
        <span className="font-medium">{row.id}</span>
      ),
    },
    {
      key: "name",
      name: t('table.name'),
      sortable: true,
      render: (row: TermSetting) => (
        <button
          onClick={() => handleNameClick(row)}
          className="text-primary hover:underline font-medium text-right"
        >
          {row.name}
        </button>
      ),
    },
    {
      key: "description",
      name: t('table.description'),
      sortable: true,
      render: (row: TermSetting) => (
        <span className="text-muted-foreground">{row.description || "-"}</span>
      ),
    },
    {
      key: "children_count",
      name: t('table.childrenCount'),
      sortable: true,
      render: (row: TermSetting) => (
        <span className="text-center block">{row.children_count}</span>
      ),
    },
    {
      key: "services",
      name: t('table.services'),
      sortable: false,
      render: (row: TermSetting) => (
        <ServicesDropdown 
          termSetting={row} 
          allServices={allServices} 
          onUpdate={refetch}
          t={t}
        />
      ),
    },
    {
      key: "status",
      name: t('table.status'),
      sortable: false,
      render: (row: TermSetting) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.is_active === 1}
            onCheckedChange={() => handleToggleActive(row.id, row.is_active)}
          />
          <span className="text-sm">
            {row.is_active === 1 ? t('table.active') : t('table.inactive')}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      name: t('table.actions'),
      sortable: false,
      render: (row: TermSetting) => (
        <RowActions
          row={row}
          onEdit={setEditingTermId}
          onDelete={handleDeleteClick}
          onView={handleViewClick}
          t={t}
        />
      ),
    },
  ];

  // Table state
  const tableState = TermSettingsTable.useTableState({
    data: termSettings,
    columns,
    totalPages,
    totalItems,
    params,
    getRowId: (term) => term.id.toString(),
    loading: isLoading,
    searchable: true,
    filtered: params.search !== "",
  });

  return (
    <div className="px-8 space-y-4">
      <TermSettingsTable
        filters={
          <TermSettingsTable.TopActions
            state={tableState}
            customActions={
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('actions.addMainTerm')}
              </Button>
            }
          />
        }
        table={
          <TermSettingsTable.Table state={tableState} loadingOptions={{ rows: 5 }} />
        }
        pagination={<TermSettingsTable.Pagination state={tableState} />}
      />

      {/* Add Dialog */}
      <AddProjectTermDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={() => {
          refetch();
          setAddDialogOpen(false);
        }}
        projectTypeId={projectTypeId}
      />

      {/* Edit Dialog */}
      <EditProjectTermDialog
        open={Boolean(editingTermId)}
        onClose={() => setEditingTermId(null)}
        onSuccess={() => {
          refetch();
          setEditingTermId(null);
        }}
        termSettingId={editingTermId}
        projectTypeId={projectTypeId}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={Boolean(deleteConfirmId)}
        onConfirm={confirmDelete}
        onClose={cancelDelete}
        title={t('dialog.deleteConfirm')}
      />

      {/* Item Actions Dialog */}
      <ItemActionsDialog
        open={itemActionsDialogOpen}
        onClose={() => {
          setItemActionsDialogOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem as any}
        onUpdate={() => {
          refetch();
        }}
        onDelete={() => {
          if (selectedItem) {
            handleDeleteClick(selectedItem.id);
          }
          setItemActionsDialogOpen(false);
        }}
        onCreate={() => {
          refetch();
        }}
        tableData={termSettings as any}
        onAction={(action, item) => {
          if (action === "edit") {
            setEditingTermId(item.id);
            setItemActionsDialogOpen(false);
          } else if (action === "delete") {
            handleDeleteClick(item.id);
            setItemActionsDialogOpen(false);
          }
        }}
      />
    </div>
  );
}

export default ProjectTermsView;
