"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import IconsGrid from "./components/IconsGrid";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { useState } from "react";
import { toast } from "sonner";
import SetIconDialog from "./components/SetIconDialog";
import { useQuery } from "@tanstack/react-query";
import { CompanyDashboardIconsApi } from "@/services/api/company-dashboard/icons";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import Can from "@/lib/permissions/client/Can";
import withPermissions from "@/lib/permissions/client/withPermissions";

function CMSIconsModule() {
  const t = useTranslations("content-management-system.icons");
  const [editingIconId, setEditingIconId] = useState<string | null>(null);
  const [deletingIconId, setDeletingIconId] = useState<string | null>(null);

  const OnEditIcon = (id: string) => {
    setEditingIconId(id);
  };
  // fetch icons use query
  const {
    data: iconsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["company-dashboard-icons"],
    queryFn: () => CompanyDashboardIconsApi.list(),
  });

  const OnDeleteIcon = async (id: string) => {
    try {
      setDeletingIconId(id);
      await CompanyDashboardIconsApi.delete(id);
      toast.success(t("deleteSuccess") || "Icon deleted successfully!");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(
        t("deleteError") || "Failed to delete icon. Please try again."
      );
    } finally {
      setDeletingIconId(null);
    }
  };

  return (
    <div className="px-6 py-2 flex flex-col gap-4">
      {/* title & add action */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Can check={[PERMISSIONS.CMS.icons.create]}>
          <DialogTrigger
            component={SetIconDialog}
            dialogProps={{
              onSuccess: () => {
                refetch();
              },
            }}
            render={({ onOpen }) => (
              <Button onClick={onOpen}>
                <PlusIcon />
                {t("addIcon")}
              </Button>
            )}
          />
        </Can>
      </div>
      {/* icons grid */}
      <Can check={[PERMISSIONS.CMS.icons.list]}>
        <IconsGrid
          OnDelete={OnDeleteIcon}
          icons={iconsData?.data?.payload || []}
          isLoading={isLoading}
          OnEdit={OnEditIcon}
          deletingIconId={deletingIconId}
        />
      </Can>
      <Can check={[PERMISSIONS.CMS.icons.update]}>
        <SetIconDialog
          open={Boolean(editingIconId)}
          onClose={() => setEditingIconId(null)}
          iconId={editingIconId || undefined}
          onSuccess={() => {
            refetch();
          }}
        />
      </Can>
    </div>
  );
}

export default withPermissions(CMSIconsModule, [PERMISSIONS.CMS.icons.list]);
