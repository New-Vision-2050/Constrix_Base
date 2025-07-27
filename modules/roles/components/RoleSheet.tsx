"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Roles from "@/modules/roles/components/Roles";
import { allStaticPermissionTypes } from "@/modules/roles/constant";
import { useLocale } from "next-intl";
import React from "react";
import { PermissionsObject, RolePermissions } from "../type";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/config/axios-config";
import { useTableStore } from "@/modules/table/store/useTableStore";

const RoleSheet = ({
  isEdit,
  isOpen,
  handleOpen,
  handleClose,
  tableId,
  selectedId,
}: {
  isEdit: boolean;
  isOpen: boolean;
  handleOpen: ({
    isEdit,
    selectedId,
  }: {
    isEdit: boolean;
    selectedId?: string;
  }) => void;
  handleClose: () => void;
  tableId?: string;
  selectedId?: string;
}) => {
  const local = useLocale();
  const isRTL = local === "ar";

  return (
    <>
      <Button
        onClick={() => {
          handleOpen({ isEdit: false, selectedId: undefined });
        }}
      >
        {" "}
        إضافة دور
      </Button>
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent
          side={isRTL ? "left" : "right"}
          style={{ width: "80vw", maxWidth: "80vw" }}
          className="overflow-y-auto max-h-screen"
        >
          <SheetHeader className="mb-4">
            <SheetTitle>{isEdit ? "تعديل دور" : "إضافة دور"}</SheetTitle>
          </SheetHeader>
          <RoleSheetContent
            isEdit={isEdit}
            handleClose={handleClose}
            tableId={tableId}
            selectedId={selectedId}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

const RoleSheetContent = ({
  isEdit,
  handleClose,
  tableId,
  selectedId,
}: {
  isEdit: boolean;
  handleClose: () => void;
  tableId?: string;
  selectedId?: string;
}) => {
  const apiUrl =
    isEdit && selectedId
      ? `/role_and_permissions/roles/${selectedId}`
      : "role_and_permissions/permissions/lookup";

  const {
    data: permissionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["permissions", isEdit, selectedId],
    queryFn: async () => {
      const res = await apiClient.get(apiUrl);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        جاري التحميل...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        حدث خطأ أثناء تحميل الصلاحيات
      </div>
    );
  }

  if (!isEdit && !permissionsData?.payload) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        لم يتم العثور على بيانات الصلاحيات
      </div>
    );
  }

  const perObj: RolePermissions = isEdit
    ? (permissionsData.payload as RolePermissions)
    : { name: "", permissions: permissionsData.payload as PermissionsObject };

  if (!perObj) {
    return null;
  }

  const onFormSuccess = () => {
    handleClose();
    if (tableId) {
      const tableStore = useTableStore.getState();
      tableStore.reloadTable(tableId);
      setTimeout(() => {
        tableStore.setLoading(tableId, false);
      }, 100);
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Roles
        allStaticPermissionTypes={allStaticPermissionTypes}
        per={perObj}
        isEdit={isEdit}
        onFormSuccess={onFormSuccess}
        selectedId={selectedId}
      />
    </div>
  );
};

export default RoleSheet;
