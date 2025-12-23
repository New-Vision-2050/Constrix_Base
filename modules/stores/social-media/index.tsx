"use client";

import { useState } from "react";
import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useSocialMediaListTableConfig } from "./_config/list-table-config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SocialMediaApi } from "@/services/api/ecommerce/social-media";
import { toast } from "sonner";
import AddSocialMediaDialog from "../components/dialogs/add-social-media";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

function ListSocialMediaView() {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      SocialMediaApi.update(id, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-media"] });
      toast.success(t("socialMedia.updateSuccess"));
      reloadTable();
    },
    onError: () => {
      toast.error(t("socialMedia.updateError"));
    },
  });

  const tableConfig = useSocialMediaListTableConfig({
    onEdit: (id: string) => {
      setEditingId(id);
      setIsDialogOpen(true);
    },
    onToggle: (id: string, isActive: boolean) => {
      toggleMutation.mutate({ id, is_active: isActive });
    },
  });

  const { reloadTable } = useTableReload(tableConfig.tableId);

  const handleAddSocialMedia = () => {
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
      <TableBuilder
        config={tableConfig}
        searchBarActions={
          <Can check={[PERMISSIONS.ecommerce.socialMedia.create]}>
            <Button onClick={handleAddSocialMedia}>
              {t("labels.add")} {t("socialMedia.singular")}
            </Button>
          </Can>
        }
        tableId={tableConfig.tableId}
      />
      <Can check={[PERMISSIONS.ecommerce.socialMedia.update]}>
        <AddSocialMediaDialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          onSuccess={handleSuccess}
          socialMediaId={editingId}
        />
      </Can>
    </>
  );
}

export default ListSocialMediaView;
