"use client";

import { useRoleCheckboxes } from "../hook/useRoleCheckboxes";
import { RolePermissions } from "../type";
import MainRoles from "./MainRoles";
import PermissionMatrix from "./PermissionMatrix";
import { useState } from "react";
import { TextField } from "@/modules/form-builder";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/config/axios-config";
import { useToast } from "@/modules/table/hooks/use-toast";

const Roles = ({
  allStaticPermissionTypes,
  per,
  isEdit,
  onFormSuccess,
  selectedId,
}: {
  allStaticPermissionTypes: string[];
  per: RolePermissions;
  isEdit: boolean;
  onFormSuccess?: () => void;
  selectedId?: string;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState<string>(per.name ?? "");
  const [error, setError] = useState<string>("");
  const permissionsObj = per.permissions;

  const {
    handleTypeChange,
    handleSelectAll,
    allChecked,
    isIndeterminate,
    areAllPermissionsSelected,
    handlePermissionChange,
    isPermissionSelected,
    isPermissionsIndeterminate,
    handleSelectAllPermissions,
    isTypeSelected,
    selectedPermissions,
  } = useRoleCheckboxes(allStaticPermissionTypes, per);

  const mutation = useMutation({
    mutationFn: async (data: { name: string; permissions: any }) => {
      if (isEdit && selectedId) {
        return apiClient.put(`/role_and_permissions/roles/${selectedId}`, data);
      }
      return apiClient.post("/role_and_permissions/roles", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Form Submitted Successfully",
      });
      onFormSuccess?.();
      if (isEdit && selectedId) {
        queryClient.invalidateQueries({
          queryKey: ["permissions", isEdit, selectedId],
        });
      }
    },
    onError: () => {
      toast({
        title: "error",
        description: "Form Submission Failed",
      });
    },
  });

  const checkValidation = () => {
    if (!name || name.trim() === "") {
      setError("اسم الدور مطلوب");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = () => {
    if (!checkValidation()) return;
    mutation.mutate({
      name,
      permissions: selectedPermissions,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-x-4">
      <div className="col-span-2 mb-4">
        <TextField
          field={{
            name: "name",
            label: "اسم الدور",
            required: true,
            type: "text",
            placeholder: "أدخل اسم الدور",
          }}
          onBlur={checkValidation}
          onChange={(e: string) => {
            setName(e);
            if (error) {
              checkValidation();
            }
          }}
          value={name}
          error={error}
          touched={!!error}
        />
      </div>
      <MainRoles
        allStaticPermissionTypes={allStaticPermissionTypes}
        handleTypeChange={handleTypeChange}
        handleSelectAll={handleSelectAll}
        allChecked={allChecked}
        isIndeterminate={isIndeterminate}
        isTypeSelected={isTypeSelected}
      />
      {Object.entries(permissionsObj).map(([key, permission], index) => (
        <PermissionMatrix
          key={key}
          name={key}
          permission={permission}
          allStaticPermissionTypes={allStaticPermissionTypes}
          handlePermissionChange={handlePermissionChange}
          areAllPermissionsSelected={areAllPermissionsSelected}
          isPermissionsIndeterminate={isPermissionsIndeterminate}
          handleSelectAllPermissions={handleSelectAllPermissions}
          isPermissionSelected={isPermissionSelected}
        />
      ))}

      {error && <p className="text-destructive col-span-2 mb-4">{error}</p>}

      <div className="col-span-2 mb-4">
        <Button
          onClick={handleSubmit}
          className="w-full"
          loading={mutation.isPending}
        >
          {isEdit ? "تعديل الدور" : "إضافة دور"}
        </Button>
      </div>
    </div>
  );
};

export default Roles;
