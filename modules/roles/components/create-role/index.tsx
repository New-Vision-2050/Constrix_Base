"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PermissionsApi } from "@/services/api/roles/permissions";
import { RolesApi } from "@/services/api/roles/roles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod schema for the form - will be created dynamically with translations
const createRoleSchema = (t: (key: string) => string) =>
  z.object({
    roleName: z
      .string()
      .min(1, t("roleNameRequired"))
      .min(3, t("roleNameMinLength")),
    permissionKeys: z.array(z.string()).min(1, t("permissionsRequired")),
  });

type CreateRoleFormData = z.infer<ReturnType<typeof createRoleSchema>>;

// Type for permission structure
interface Permission {
  id: string;
  name: string;
  key?: string; // Add key property for permission keys
}

/**
 * CreateRoleForm Component
 *
 * A versatile form component that handles both creating new roles and editing existing ones.
 *
 * Usage Examples:
 *
 * 1. Create Mode (default):
 * <CreateRoleForm />
 *
 * 2. Edit Mode:
 * <CreateRoleForm
 *   editMode={{
 *     roleId: "role-123",
 *     roleName: "Admin Role",
 *     permissionKeys: ["permission-1", "permission-2", "permission-3"]
 *   }}
 * />
 */

// Props interface for the component
interface CreateRoleFormProps {
  editMode?: {
    roleId: string;
    roleName: string;
    permissionKeys: string[];
  };
  onSuccess?: () => void; // Callback for successful form submission
}

function CreateRoleForm({ editMode, onSuccess }: CreateRoleFormProps) {
  const t = useTranslations("CreateRole");
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(editMode?.permissionKeys || [])
  );

  const lookupsQuery = useQuery({
    queryKey: ["permissionsLookups"],
    queryFn: () => PermissionsApi.lookups(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema(t)),
    defaultValues: {
      roleName: editMode?.roleName || "",
      permissionKeys: editMode?.permissionKeys || [],
    },
  });

  // Get all permissions for toggle all functionality
  const allPermissions = useMemo(() => {
    if (!lookupsQuery.data?.data?.payload) return [];

    const permissions: Permission[] = [];
    Object.values(lookupsQuery.data.data.payload).forEach(
      (categoryValue: unknown) => {
        if (typeof categoryValue === "object" && categoryValue !== null) {
          Object.values(categoryValue as Record<string, unknown>).forEach(
            (subCategoryValue: unknown) => {
              if (
                typeof subCategoryValue === "object" &&
                subCategoryValue !== null
              ) {
                Object.values(
                  subCategoryValue as Record<string, unknown>
                ).forEach((permissionGroup: unknown) => {
                  if (Array.isArray(permissionGroup)) {
                    permissions.push(...permissionGroup);
                  }
                });
              }
            }
          );
        }
      }
    );
    return permissions;
  }, [lookupsQuery.data]);

  // Check if all permissions are selected
  const areAllSelected =
    selectedPermissions.size === allPermissions.length &&
    allPermissions.length > 0;

  // Update form value when selectedPermissions changes
  useEffect(() => {
    setValue("permissionKeys", Array.from(selectedPermissions));
  }, [selectedPermissions, setValue]);

  // Reset form when editMode changes (e.g., when drawer opens with new data)
  useEffect(() => {
    if (editMode) {
      setValue("roleName", editMode.roleName);
      setValue("permissionKeys", editMode.permissionKeys);
      setSelectedPermissions(new Set(editMode.permissionKeys));
    } else {
      setValue("roleName", "");
      setValue("permissionKeys", []);
      setSelectedPermissions(new Set());
    }
  }, [editMode, setValue]);

  // Toggle individual permission
  const togglePermission = (permissionKey: string) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(permissionKey)) {
        newSet.delete(permissionKey);
      } else {
        newSet.add(permissionKey);
      }
      return newSet;
    });
  };

  // Toggle all permissions
  const toggleAllPermissions = () => {
    const allPermissionKeys = new Set(allPermissions.map((p) => p.key || p.id));
    if (selectedPermissions.size === allPermissions.length) {
      setSelectedPermissions(new Set());
    } else {
      setSelectedPermissions(allPermissionKeys);
    }
  };

  // Toggle all permissions for a specific category
  const toggleCategoryPermissions = (categoryPermissions: Permission[]) => {
    const categoryPermissionKeys = new Set(
      categoryPermissions.map((p) => p.key || p.id)
    );
    const allCategorySelected = categoryPermissions.every((p) =>
      selectedPermissions.has(p.key || p.id)
    );

    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      if (allCategorySelected) {
        // Remove all category permissions
        categoryPermissionKeys.forEach((key) => newSet.delete(key));
      } else {
        // Add all category permissions
        categoryPermissionKeys.forEach((key) => newSet.add(key));
      }
      return newSet;
    });
  };

  // Get permissions for a specific category
  const getCategoryPermissions = (categoryValue: unknown): Permission[] => {
    const permissions: Permission[] = [];
    if (typeof categoryValue === "object" && categoryValue !== null) {
      Object.values(categoryValue as Record<string, unknown>).forEach(
        (subCategoryValue: unknown) => {
          if (
            typeof subCategoryValue === "object" &&
            subCategoryValue !== null
          ) {
            Object.values(subCategoryValue as Record<string, unknown>).forEach(
              (permissionGroup: unknown) => {
                if (Array.isArray(permissionGroup)) {
                  permissions.push(...permissionGroup);
                }
              }
            );
          }
        }
      );
    }
    return permissions;
  };

  // Get permissions for a specific subcategory
  const getSubCategoryPermissions = (
    subCategoryValue: unknown
  ): Permission[] => {
    const permissions: Permission[] = [];
    if (typeof subCategoryValue === "object" && subCategoryValue !== null) {
      Object.values(subCategoryValue as Record<string, unknown>).forEach(
        (permissionGroup: unknown) => {
          if (Array.isArray(permissionGroup)) {
            permissions.push(...permissionGroup);
          }
        }
      );
    }
    return permissions;
  };

  const onSubmit = async (data: CreateRoleFormData) => {
    console.log("Form submitted:", data);
    console.log("Selected permissions:", Array.from(selectedPermissions));

    try {
      if (editMode) {
        // Update existing role
        await RolesApi.update(editMode.roleId, {
          name: data.roleName,
          permissions: Array.from(selectedPermissions),
        });
        console.log("Role updated successfully");
      } else {
        // Create new role
        await RolesApi.create({
          name: data.roleName,
          permissions: Array.from(selectedPermissions),
        });
        console.log("Role created successfully");
      }

      // Call success callback if provided
      onSuccess?.();
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  if (lookupsQuery.isLoading || !lookupsQuery.data) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="w-full space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold">
        {editMode ? t("editTitle") : t("title")}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 rounded-xl w-full space-y-6"
      >
        {/* Role Name Field */}
        <div className="space-y-2">
          <Input
            label={t("roleName")}
            {...register("roleName")}
            error={errors.roleName?.message}
            placeholder={t("roleNamePlaceholder")}
          />
        </div>

        {/* Toggle All Permissions */}
        <div className="flex items-center space-x-3 p-4 bg-sidebar rounded-lg">
          <Checkbox
            id="toggle-all"
            checked={areAllSelected}
            onCheckedChange={toggleAllPermissions}
          />
          <label
            htmlFor="toggle-all"
            className="text-base font-medium cursor-pointer"
          >
            {areAllSelected ? t("deselectAll") : t("selectAll")} (
            {selectedPermissions.size}/{allPermissions.length})
          </label>
        </div>

        {/* Permissions Display Error */}
        {errors.permissionKeys && (
          <div className="text-red-500 text-base">
            {errors.permissionKeys.message}
          </div>
        )}

        {/* Permissions Grid */}
        <div className="space-y-4">
          {lookupsQuery.data.data &&
            Object.entries(lookupsQuery.data.data.payload).map(
              ([key, value]) => {
                const categoryPermissions = getCategoryPermissions(value);
                const allCategorySelected = categoryPermissions.every((p) =>
                  selectedPermissions.has(p.key || p.id)
                );

                return (
                  <Accordion type="multiple" key={key}>
                    <AccordionItem value={key}>
                      <div className="bg-sidebar rounded-xl flex items-center px-4">
                        <Checkbox
                          id={`category-${key}`}
                          checked={allCategorySelected}
                          onCheckedChange={() => {
                            toggleCategoryPermissions(categoryPermissions);
                          }}
                        />
                        <div className="grow">
                          <AccordionTrigger>
                            <div className="flex items-center justify-between w-full">
                              <h3 className="text-xl font-semibold">{key}</h3>
                              <span className="text-base text-gray-500">
                                (
                                {
                                  categoryPermissions.filter((p) =>
                                    selectedPermissions.has(p.key || p.id)
                                  ).length
                                }
                                /{categoryPermissions.length})
                              </span>
                            </div>
                          </AccordionTrigger>
                        </div>
                      </div>
                      <AccordionContent className="rounded-xl">
                        <div className="bg-background p-4 space-y-4">
                          {Object.entries(value).map(([subKey, subValue]) => {
                            const subCategoryPermissions =
                              getSubCategoryPermissions(subValue);
                            const allSubCategorySelected =
                              subCategoryPermissions.every((p) =>
                                selectedPermissions.has(p.key || p.id)
                              );

                            return (
                              <Accordion type="multiple" key={subKey}>
                                <AccordionItem value={subKey}>
                                  <div className="bg-sidebar rounded-xl flex items-center px-4">
                                    <Checkbox
                                      id={`subcategory-${subKey}`}
                                      checked={allSubCategorySelected}
                                      onCheckedChange={() => {
                                        toggleCategoryPermissions(
                                          subCategoryPermissions
                                        );
                                      }}
                                    />
                                    <div className="grow">
                                      <AccordionTrigger>
                                        <div className="flex items-center justify-between w-full mr-4">
                                          <h3 className="text-lg font-semibold">
                                            {subKey}
                                          </h3>
                                          <span className="text-base text-gray-500">
                                            (
                                            {
                                              subCategoryPermissions.filter(
                                                (p) =>
                                                  selectedPermissions.has(
                                                    p.key || p.id
                                                  )
                                              ).length
                                            }
                                            /{subCategoryPermissions.length})
                                          </span>
                                        </div>
                                      </AccordionTrigger>
                                    </div>
                                  </div>
                                  <AccordionContent className="rounded-xl">
                                    <div
                                      key={subKey}
                                      className="rounded-lg bg-background p-4"
                                    >
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(subValue).map(
                                          ([permKey, permissions]) => {
                                            const cardPermissions =
                                              permissions as Permission[];
                                            const allCardSelected =
                                              cardPermissions.every((p) =>
                                                selectedPermissions.has(
                                                  p.key || p.id
                                                )
                                              );

                                            return (
                                              <Accordion
                                                type="multiple"
                                                key={permKey}
                                              >
                                                <AccordionItem value={permKey}>
                                                  <div className="bg-sidebar rounded-xl flex items-center px-4">
                                                    <Checkbox
                                                      id={`card-${permKey}`}
                                                      checked={allCardSelected}
                                                      onCheckedChange={() =>
                                                        toggleCategoryPermissions(
                                                          cardPermissions
                                                        )
                                                      }
                                                    />
                                                    <div className="grow">
                                                      <AccordionTrigger>
                                                        <div className="flex items-center justify-between w-full">
                                                          <h4 className="text-base font-semibold text-white">
                                                            {permKey}
                                                          </h4>
                                                          <span className="text-sm text-gray-400">
                                                            (
                                                            {
                                                              cardPermissions.filter(
                                                                (p) =>
                                                                  selectedPermissions.has(
                                                                    p.key ||
                                                                      p.id
                                                                  )
                                                              ).length
                                                            }
                                                            /
                                                            {
                                                              cardPermissions.length
                                                            }
                                                            )
                                                          </span>
                                                        </div>
                                                      </AccordionTrigger>
                                                    </div>
                                                  </div>
                                                  <AccordionContent className="rounded-xl">
                                                    <div className="bg-sidebar p-4 space-y-3">
                                                      {cardPermissions.map(
                                                        (permission) => (
                                                          <div
                                                            key={permission.id}
                                                            className="flex items-center space-x-3 p-3 rounded hover:bg-sidebar/80 transition-colors"
                                                          >
                                                            <label
                                                              htmlFor={
                                                                permission.id
                                                              }
                                                              className="text-base text-gray-200 cursor-pointer flex-1 grow"
                                                            >
                                                              {permission.name}
                                                            </label>
                                                            <Checkbox
                                                              id={permission.id}
                                                              checked={selectedPermissions.has(
                                                                permission.key ||
                                                                  permission.id
                                                              )}
                                                              onCheckedChange={() =>
                                                                togglePermission(
                                                                  permission.key ||
                                                                    permission.id
                                                                )
                                                              }
                                                            />
                                                          </div>
                                                        )
                                                      )}
                                                    </div>
                                                  </AccordionContent>
                                                </AccordionItem>
                                              </Accordion>
                                            );
                                          }
                                        )}
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              }
            )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (editMode) {
                setSelectedPermissions(new Set(editMode.permissionKeys));
                setValue("roleName", editMode.roleName);
                setValue("permissionKeys", editMode.permissionKeys);
              } else {
                setSelectedPermissions(new Set());
                setValue("roleName", "");
                setValue("permissionKeys", []);
              }
            }}
          >
            {t("reset")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? editMode
                ? t("updating")
                : t("creating")
              : editMode
              ? t("updateRole")
              : t("createRole")}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateRoleForm;
