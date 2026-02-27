"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import HeadlessTableLayout from "@/components/headless/table";
import { ProjectTermsApi } from "@/services/api/projects/project-terms";
import { TermSetting } from "@/services/api/projects/project-terms/types/response";
import { AddProjectTermDialog } from "./AddProjectTermDialog";
import { EditProjectTermDialog } from "./EditProjectTermDialog";
import ConfirmDeleteDialog from "@/modules/company-profile/components/official-data/official-docs-section/docs-settings-dialog/AddDocumentType/ConfirmDeleteDialog";
import { toast } from "sonner";
import { Plus, Eye } from "lucide-react";
import { Switch as SwitchUI } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface ItemActionsDialogProps {
  open: boolean;
  onClose: () => void;
  item: TermSetting | null;
  onUpdate: () => void;
  onDelete: () => void;
  onCreate: () => void;
  tableData: TermSetting[];
  onAction: (action: string, item: TermSetting) => void;
}

const ChildrenTable = HeadlessTableLayout<TermSetting>("children-terms");

interface RowActionsProps {
  row: TermSetting;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

function RowActions({ row, onEdit, onDelete }: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          إجراءات
          <ChevronDown className="h-4 w-4 mr-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(row.id)}>
          تعديل
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(row.id)} className="text-destructive">
          حذف
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ServicesDropdownProps {
  termSetting: TermSetting;
  allServices: Array<{ id: number; name: string }>;
  onUpdate: () => void;
}

function ServicesDropdown({ termSetting, allServices, onUpdate }: ServicesDropdownProps) {
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>(
    termSetting.services?.map(s => s.id) || []
  );
  const [isUpdating, setIsUpdating] = useState(false);

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
      toast.success("تم تحديث الخدمات بنجاح");
      onUpdate();
    } catch (error) {
      console.error("Error updating services:", error);
      toast.error("حدث خطأ أثناء تحديث الخدمات");
      setSelectedServiceIds(termSetting.services?.map(s => s.id) || []);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8" disabled={isUpdating}>
          اختر الخدمات
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


export function ItemActionsDialog({ open, onClose, item, onUpdate, onDelete, onCreate, tableData, onAction }: ItemActionsDialogProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingTermId, setEditingTermId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
  // Table params
  const params = ChildrenTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  // Fetch children
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["term-children", item?.id, params.page, params.limit],
    queryFn: async () => {
      if (!item?.id) return null;
      try {
        const response = await ProjectTermsApi.getTermChildren(item.id);
        return response.data;
      } catch (error: any) {
        console.error("Error fetching children:", error);
        console.error("Response:", error.response);
        throw error;
      }
    },
    enabled: open && !!item?.id,
    retry: false,
  });

  const children = useMemo<TermSetting[]>(
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

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await ProjectTermsApi.deleteTermSetting(deleteConfirmId);
      toast.success("تم حذف البند بنجاح");
      setDeleteConfirmId(null);
      refetch();
    } catch {
      toast.error("حدث خطأ أثناء حذف البند");
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
      toast.success(newStatus === 1 ? "تم تفعيل البند بنجاح" : "تم إلغاء تفعيل البند بنجاح");
      refetch();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("حدث خطأ أثناء تحديث حالة البند");
    }
  };

  // Define table columns
  const columns = [
    {
      key: "id",
      name: "الرقم المرجعي",
      sortable: true,
      render: (row: TermSetting) => (
        <span className="font-medium">{row.id}</span>
      ),
    },
    {
      key: "name",
      name: "اسم البند",
      sortable: true,
      render: (row: TermSetting) => (
        <span className="font-medium">{row.name}</span>
      ),
    },
    {
      key: "description",
      name: "وصف البند",
      sortable: true,
      render: (row: TermSetting) => (
        <span className="text-muted-foreground">{row.description || "-"}</span>
      ),
    },
    {
      key: "children_count",
      name: "عدد البنود الفرعية",
      sortable: true,
      render: (row: TermSetting) => (
        <span className="text-center block">{row.children_count}</span>
      ),
    },
    {
      key: "services",
      name: "خدمات البند",
      sortable: false,
      render: (row: TermSetting) => (
        <ServicesDropdown 
          termSetting={row} 
          allServices={allServices} 
          onUpdate={refetch}
        />
      ),
    },
    {
      key: "status",
      name: "تفعيل البند",
      sortable: false,
      render: (row: TermSetting) => (
        <div className="flex items-center gap-2">
          <SwitchUI
            checked={row.is_active === 1}
            onCheckedChange={() => handleToggleActive(row.id, row.is_active)}
          />
          <span className="text-sm">
            {row.is_active === 1 ? "نشط" : "غير نشط"}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      name: "إجراءات",
      sortable: false,
      render: (row: TermSetting) => (
        <RowActions
          row={row}
          onEdit={setEditingTermId}
          onDelete={handleDeleteClick}
        />
      ),
    },
  ];

  // Table state
  const tableState = ChildrenTable.useTableState({
    data: children,
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full bg-sidebar max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            إجراءات البند: {item?.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center">
            الرقم المرجعي: {item?.id}
          </p>
        </DialogHeader>

        <div className="space-y-4" dir="rtl">
          {/* Add Button Above Table */}
          <div className="flex justify-end">
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة جديد
            </Button>
          </div>

          {/* Table */}
          <ChildrenTable
            filters={
              <ChildrenTable.TopActions state={tableState} />
            }
            table={
              <ChildrenTable.Table state={tableState} loadingOptions={{ rows: 5 }} />
            }
            pagination={<ChildrenTable.Pagination state={tableState} />}
          />
        </div>

        {/* Add Child Dialog */}
        <AddProjectTermDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onSuccess={() => {
            refetch();
            setAddDialogOpen(false);
            onCreate();
          }}
          projectTypeId={item?.project_type_id || null}
          parentId={item?.id || null}
        />

        {/* Edit Dialog */}
        <EditProjectTermDialog
          open={Boolean(editingTermId)}
          onClose={() => setEditingTermId(null)}
          onSuccess={() => {
            refetch();
            setEditingTermId(null);
            onUpdate();
          }}
          termSettingId={editingTermId}
          projectTypeId={item?.project_type_id || null}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDeleteDialog
          open={Boolean(deleteConfirmId)}
          onConfirm={confirmDelete}
          onClose={cancelDelete}
          title="هل أنت متأكد من حذف هذا البند؟"
        />
      </DialogContent>
    </Dialog>
  );
}
