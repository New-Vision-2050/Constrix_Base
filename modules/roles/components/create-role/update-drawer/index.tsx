"use client";

import { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CreateRoleForm from "@/modules/roles/components/create-role";
import { RolesApi } from "@/services/api/roles/roles";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import { ROLE_Permission } from "@/types/api/roles/permission";

type Props = {
  open: boolean;
  onClose: VoidFunction;
  roleId?: string; // Optional - if not provided, component is in create mode
  onSuccess?: () => void; // Optional callback for successful role update/create
};

function RoleDrawer({ open, onClose, roleId, onSuccess }: Props) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const t = useTranslations("CreateRole");

  // Fetch role data - refetch every time the drawer opens (only in edit mode)
  const {
    data: roleData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["role", roleId, open], // Include 'open' to make query unique per session
    queryFn: () => RolesApi.show(roleId!), // Non-null assertion since enabled condition ensures roleId exists
    enabled: open && !!roleId, // Only fetch when drawer is open and roleId exists (edit mode)
    refetchOnMount: true, // Always refetch when component mounts
    staleTime: 0, // Consider data immediately stale
    gcTime: 0, // Don't cache the data
  });

  // Refetch data whenever the drawer opens (only in edit mode)
  useEffect(() => {
    if (open && roleId) {
      refetch();
    }
  }, [open, roleId, refetch]);

  // Extract permissions array from the nested structure
  const extractPermissionKeys = (
    permissions: Record<
      string,
      Record<string, Record<string, ROLE_Permission[]>>
    >
  ): string[] => {
    const permissionKeys: string[] = [];

    if (permissions && typeof permissions === "object") {
      Object.values(permissions).forEach((categoryValue) => {
        if (typeof categoryValue === "object" && categoryValue !== null) {
          Object.values(categoryValue).forEach((subCategoryValue) => {
            if (
              typeof subCategoryValue === "object" &&
              subCategoryValue !== null
            ) {
              Object.values(subCategoryValue).forEach((permissionGroup) => {
                if (Array.isArray(permissionGroup)) {
                  permissionGroup.forEach((permission) => {
                    if (permission.key) {
                      permissionKeys.push(permission.key);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }

    return permissionKeys;
  };

  const renderContent = () => {
    // If in create mode (no roleId), render form immediately
    if (!roleId) {
      return (
        <CreateRoleForm
          onSuccess={() => {
            onClose();
            onSuccess?.(); // Call the optional success callback
          }}
        />
      );
    }

    // Edit mode - handle loading states
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>{t("loading")}</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-500">
            <p>{t("errorLoadingRole") || "Error loading role data"}</p>
          </div>
        </div>
      );
    }

    if (!roleData?.data?.payload) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-500">
            <p>{t("roleNotFound") || "Role not found"}</p>
          </div>
        </div>
      );
    }

    // Edit mode with data loaded
    const role = roleData.data.payload;
    const permissionKeys = extractPermissionKeys(role.permissions);

    return (
      <CreateRoleForm
        editMode={{
          roleId: role.id,
          roleName: role.name,
          permissionKeys: permissionKeys,
        }}
        onSuccess={() => {
          onClose();
          onSuccess?.(); // Call the optional success callback
          // You can add any additional success logic here, like showing a toast
        }}
      />
    );
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side={isRTL ? "left" : "right"}
        style={{ width: "80vw", maxWidth: "80vw" }}
        className="overflow-y-auto max-h-screen"
      >
        <SheetHeader className="mb-4">
          <SheetTitle>{roleId ? t("editTitle") : t("title")}</SheetTitle>
        </SheetHeader>
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
}

export default RoleDrawer;
