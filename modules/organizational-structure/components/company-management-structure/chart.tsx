"use client";
import { Loader2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { OrgChartNode } from "@/types/organization";
import { SheetFormBuilder, useSheetForm } from "@/modules/form-builder";
import useManagementsTreeData from "@/modules/organizational-structure/hooks/useManagementsTreeData";
import OrganizationChart from "@/modules/organizational-structure/org-chart/components/organization-chart";
import { CloneManagement } from "./clone-management";
import { GetOrgStructureManagementFormConfig } from "./set-management-form";
import { useManagementsStructureCxt } from "./ManagementsStructureCxt";
import { apiClient } from "@/config/axios-config";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { DropdownItemT } from "@/components/shared/dropdown-button";
import { CompanyData } from "@/modules/company-profile/types/company";
import DialogFormBuilder from "@/modules/form-builder/components/DialogFormBuilder";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

type PropsT = {
  branchId: string | number;
  companyData?: CompanyData
  mainBranch?: {id:string ; name:string}
};

function normalizeManagementDeleteApiMessage(message: string): string {
  return message
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\.+$/g, "")
    .toLowerCase();
}

/** Backend `message` values (normalized) → next-intl keys under `ManagementStructure`. */
const MANAGEMENT_DELETE_ERROR_I18N_KEY: Record<string, string> = {
  "cannot delete management hierarchy that has children":
    "deleteErrors.hasChildren",
};

const BranchManagementsStructure = (props: PropsT) => {
  const { branchId , companyData, mainBranch } = props;
  const t = useTranslations("CompanyStructure.ManagementStructure");
  const [deletedId, setDeletedId] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const {
    isUserCompanyOwner,
    selectedNode,
    companyOwnerId,
    handleStoreSelectedNode,
  } = useManagementsStructureCxt();

  const cloneManagementConfig = useMemo(() => {
    return CloneManagement({
      isEdit,
      onClose,
      branchId,
      selectedNode,
      isUserCompanyOwner,
      companyOwnerId,
      companyData
    });
  }, [isUserCompanyOwner, companyOwnerId, selectedNode, branchId, isEdit]);


  const addManagementConfig = useMemo(() => {
    return GetOrgStructureManagementFormConfig({
      isEdit,
      onClose,
      branchId,
      selectedNode,
      isUserCompanyOwner,
      companyOwnerId,
      mainBranch
    });
  }, [isUserCompanyOwner, companyOwnerId, selectedNode, branchId, isEdit]);


  const { openSheet, isOpen, closeSheet } = useSheetForm({ config:cloneManagementConfig });
  const { openSheet: openAddSheet, isOpen: isAddSheetOpen, closeSheet: closeAddSheet } = useSheetForm({ config:addManagementConfig });

  const {
    data: orgData,
    isLoading,
    error,
    refetch: refreshOrgChart,
  } = useManagementsTreeData(branchId);
  const onAddBtnClick = useCallback((node: OrgChartNode) => {
    setIsEdit(false);
    handleStoreSelectedNode(node);
    openSheet();
  }, []);

  function onClose() {
    refreshOrgChart();
    closeSheet();
    closeAddSheet();
  }

  const onEditBtnClick = useCallback((node: OrgChartNode) => {
    setIsEdit(true);
    handleStoreSelectedNode(node);
    openSheet();
  }, []);

  const DropDownMenu = (node: OrgChartNode): DropdownItemT[] => {
    return [
      {
        text: t("edit"),
        onClick: () => {
          onEditBtnClick?.(node);
        },
      },
      {
        text: t("delete"),
        onClick: () => {
          handleDeleteManagement?.(node.id);
        },
      },
    ];
  };

  const listModeDropDownMenu = (node: OrgChartNode): DropdownItemT[] => {
    return [
      {
        text: t("addManagement"),
        onClick: () => {
          onAddBtnClick?.(node);
        },
      },
      ...DropDownMenu(node),
    ];
  };

  const handleDeleteManagement = (id: string | number) => {
    setDeletedId(id as string);
    setOpenDeleteDialog(true);
  };

  const handleConfirm = async () => {
    apiClient
      .delete(`/management_hierarchies/${deletedId}`)
      .then(() => {
        refreshOrgChart();
        setOpenDeleteDialog(false);
        toast.success(t("deleteSuccess"));
      })
      .catch((err) => {
        const apiMessage = isAxiosError(err)
          ? String(
              (err.response?.data as { message?: string } | undefined)
                ?.message ?? ""
            ).trim()
          : "";
        const mappedKey =
          MANAGEMENT_DELETE_ERROR_I18N_KEY[
            normalizeManagementDeleteApiMessage(apiMessage)
          ];
        const message = mappedKey
          ? t(mappedKey as "deleteErrors.hasChildren")
          : apiMessage || t("deleteError");
        toast.error(message);
      });
  };

  return (
    <main className="flex-grow md:max-w-[calc(100vw-580px)]">
      {/* sheet form */}
      <DialogFormBuilder
        isOpen={isOpen}
        config={cloneManagementConfig}
        onOpenChange={(open) => (open ? openSheet() : closeSheet())}
      />
      <SheetFormBuilder
        isOpen={isAddSheetOpen}
        config={addManagementConfig}
        onOpenChange={(open) => (open ? openAddSheet() : closeAddSheet())}
      />
      {/* confirm delete dialog */}
      <ConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirm}
        description={t("confirmDelete")}
      />

      {isLoading && (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ltr:ml-2 rtl:mr-2 text-lg text-gray-600">
            {t("loading")}
          </span>
        </div>
      )}

      {!isLoading && !error && orgData && orgData?.length > 0 && (
        <div className="overflow-hidden">
          <OrganizationChart
            // ignoreAddAtFirstNode={true}
            data={orgData?.[0] as OrgChartNode}
            onAddBtnClick={(node) => onAddBtnClick(node)}
            DropDownMenu={DropDownMenu}
            listModeDropDownMenu={listModeDropDownMenu}
            listViewAdditionalActions={
              <Can check={[PERMISSIONS.organization.management.create]}>
                <Button onClick={() => openAddSheet()}>{t("addManagement")}</Button>
              </Can>
            }
          />
        </div>
      )}
    </main>
  );
};

export default BranchManagementsStructure;
