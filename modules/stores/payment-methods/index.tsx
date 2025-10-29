"use client";

import { useState } from "react";
import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { baseURL } from "@/config/axios-config";
import { usePaymentMethodListTableConfig } from "./_config/list-table-config";

function ListPaymentMethodsView() {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      axios.patch(`${baseURL}/ecommerce/dashboard/payment_methods/${id}`, {
        is_active,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success(t("paymentMethods.updateSuccess"));
      reloadTable();
    },
    onError: () => {
      toast.error(t("paymentMethods.updateError"));
    },
  });

  const tableConfig = usePaymentMethodListTableConfig({
    onEdit: (id: string) => {
      setEditingId(id);
      setIsDialogOpen(true);
    },
    onToggle: (id: string, isActive: boolean) => {
      toggleMutation.mutate({ id, is_active: isActive });
    },
  });

  const { reloadTable } = useTableReload(tableConfig.tableId);

  const handleAddPaymentMethod = () => {
    setEditingId(undefined);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingId(undefined);
  };

  const handleSuccess = () => {
    reloadTable();
  };

  return (
    <>
      <TableBuilder config={tableConfig} tableId={tableConfig.tableId} />
    </>
  );
}

export default ListPaymentMethodsView;
