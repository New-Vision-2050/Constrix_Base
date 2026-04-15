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
import { ProjectRolesApi } from "@/services/api/projects/project-roles";
import type {
  ProjectPermission,
  ProjectPermissionsTree,
} from "@/services/api/projects/project-roles/types/response";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useProjectRolesTranslations } from "../useProjectRolesTranslations";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createRoleSchema = (
  t: ReturnType<typeof useProjectRolesTranslations>,
) =>
  z.object({
    roleName: z
      .string()
      .min(1, t("roleNameRequired"))
      .min(3, t("roleNameMinLength")),
    permissionIds: z.array(z.string()).min(1, t("permissionsRequired")),
  });

type FormData = z.infer<ReturnType<typeof createRoleSchema>>;

interface EditMode {
  roleId: string;
  roleName: string;
  permissionIds: string[];
}

interface Props {
  projectId: string;
  editMode?: EditMode;
  onSuccess?: () => void;
}

function extractAllIds(tree: ProjectPermissionsTree): string[] {
  const ids: string[] = [];
  Object.values(tree).forEach((subcategories) => {
    Object.values(subcategories).forEach((permissions) => {
      permissions.forEach((p) => ids.push(p.id));
    });
  });
  return ids;
}

function getCategoryPermissions(
  categoryValue: Record<string, ProjectPermission[]>,
): ProjectPermission[] {
  const perms: ProjectPermission[] = [];
  Object.values(categoryValue).forEach((list) => perms.push(...list));
  return perms;
}

export default function ProjectCreateRoleForm({
  projectId,
  editMode,
  onSuccess,
}: Props) {
  const t = useProjectRolesTranslations();
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(editMode?.permissionIds ?? []),
  );

  const treeQuery = useQuery({
    queryKey: ["projectPermissionsTree"],
    queryFn: () => ProjectRolesApi.permissionsTree(),
  });

  const rawTree = treeQuery.data?.data?.payload;
  const tree: ProjectPermissionsTree | undefined =
    rawTree && !Array.isArray(rawTree) && Object.keys(rawTree).length > 0
      ? rawTree
      : undefined;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(createRoleSchema(t)),
    defaultValues: {
      roleName: editMode?.roleName ?? "",
      permissionIds: editMode?.permissionIds ?? [],
    },
  });

  const allPermissions = useMemo(() => {
    if (!tree) return [];
    const perms: ProjectPermission[] = [];
    Object.values(tree).forEach((subcategories) => {
      Object.values(subcategories).forEach((list) => perms.push(...list));
    });
    return perms;
  }, [tree]);

  const areAllSelected =
    allPermissions.length > 0 &&
    selectedPermissions.size === allPermissions.length;

  useEffect(() => {
    setValue("permissionIds", Array.from(selectedPermissions));
  }, [selectedPermissions, setValue]);

  useEffect(() => {
    if (editMode) {
      setValue("roleName", editMode.roleName);
      setValue("permissionIds", editMode.permissionIds);
      setSelectedPermissions(new Set(editMode.permissionIds));
    } else {
      setValue("roleName", "");
      setValue("permissionIds", []);
      setSelectedPermissions(new Set());
    }
  }, [editMode, setValue]);

  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllPermissions = () => {
    if (areAllSelected) {
      setSelectedPermissions(new Set());
    } else {
      setSelectedPermissions(new Set(allPermissions.map((p) => p.id)));
    }
  };

  const toggleGroup = (permissions: ProjectPermission[]) => {
    const ids = permissions.map((p) => p.id);
    const allSelected = ids.every((id) => selectedPermissions.has(id));
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const onSubmit = async (data: FormData) => {
    try {
      const body = {
        name: data.roleName,
        permission_ids: Array.from(selectedPermissions),
      };

      if (editMode) {
        await ProjectRolesApi.update(projectId, editMode.roleId, body);
      } else {
        await ProjectRolesApi.create(projectId, body);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  const resetForm = () => {
    if (editMode) {
      setValue("roleName", editMode.roleName);
      setValue("permissionIds", editMode.permissionIds);
      setSelectedPermissions(new Set(editMode.permissionIds));
    } else {
      setValue("roleName", "");
      setValue("permissionIds", []);
      setSelectedPermissions(new Set());
    }
  };

  if (treeQuery.isLoading) {
    return <div>{t("loading")}</div>;
  }

  const formFields = (
    <div className="space-y-4">
      <Input
        label={t("roleName")}
        {...register("roleName")}
        error={errors.roleName?.message}
        placeholder={t("roleNamePlaceholder")}
      />
    </div>
  );

  const submitButtons = (
    <div className="flex justify-end gap-4 pt-6">
      <Button type="button" variant="outline" onClick={resetForm}>
        {t("reset")}
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? editMode
            ? t("updating")
            : t("creating")
          : editMode
            ? t("submitUpdateRole")
            : t("submitCreateRole")}
      </Button>
    </div>
  );

  if (!tree) {
    return (
      <div className="w-full space-y-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 rounded-xl w-full space-y-6"
        >
          {formFields}

          <div className="p-4 bg-sidebar rounded-lg text-center text-gray-400">
            {t("permissions")} (0)
          </div>

          {errors.permissionIds && (
            <div className="text-red-500 text-base">
              {errors.permissionIds.message}
            </div>
          )}

          {submitButtons}
        </form>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 rounded-xl w-full space-y-6"
      >
        {formFields}

        <div className="flex items-center gap-3 p-4 bg-sidebar rounded-lg">
          <Checkbox
            id="toggle-all-project"
            checked={areAllSelected}
            onCheckedChange={toggleAllPermissions}
          />
          <label
            htmlFor="toggle-all-project"
            className="text-base font-medium cursor-pointer"
          >
            {areAllSelected ? t("deselectAll") : t("selectAll")} (
            {selectedPermissions.size}/{allPermissions.length})
          </label>
        </div>

        {errors.permissionIds && (
          <div className="text-red-500 text-base">
            {errors.permissionIds.message}
          </div>
        )}

        <div className="space-y-4">
          {Object.entries(tree).map(([categoryName, subcategories]) => {
            const catPerms = getCategoryPermissions(subcategories);
            const allCatSelected = catPerms.every((p) =>
              selectedPermissions.has(p.id),
            );

            return (
              <Accordion type="multiple" key={categoryName}>
                <AccordionItem value={categoryName}>
                  <div className="bg-sidebar rounded-xl flex items-center gap-2 px-4">
                    <Checkbox
                      id={`cat-${categoryName}`}
                      checked={allCatSelected}
                      onCheckedChange={() => toggleGroup(catPerms)}
                    />
                    <div className="grow">
                      <AccordionTrigger>
                        <div className="flex items-center justify-between w-full">
                          <h3 className="text-xl font-semibold">
                            {categoryName}
                          </h3>
                          <span className="text-base text-gray-500">
                            (
                            {
                              catPerms.filter((p) =>
                                selectedPermissions.has(p.id),
                              ).length
                            }
                            /{catPerms.length})
                          </span>
                        </div>
                      </AccordionTrigger>
                    </div>
                  </div>

                  <AccordionContent className="rounded-xl">
                    <div className="bg-background p-4 space-y-4">
                      {Object.entries(subcategories).map(
                        ([subName, permissions]) => {
                          const allSubSelected = permissions.every((p) =>
                            selectedPermissions.has(p.id),
                          );

                          return (
                            <Accordion type="multiple" key={subName}>
                              <AccordionItem value={subName}>
                                <div className="bg-sidebar rounded-xl flex items-center gap-2 px-4">
                                  <Checkbox
                                    id={`sub-${categoryName}-${subName}`}
                                    checked={allSubSelected}
                                    onCheckedChange={() =>
                                      toggleGroup(permissions)
                                    }
                                  />
                                  <div className="grow">
                                    <AccordionTrigger>
                                      <div className="flex items-center justify-between w-full me-4">
                                        <h3 className="text-lg font-semibold">
                                          {subName}
                                        </h3>
                                        <span className="text-base text-gray-500">
                                          (
                                          {
                                            permissions.filter((p) =>
                                              selectedPermissions.has(p.id),
                                            ).length
                                          }
                                          /{permissions.length})
                                        </span>
                                      </div>
                                    </AccordionTrigger>
                                  </div>
                                </div>

                                <AccordionContent className="rounded-xl">
                                  <div className="bg-sidebar p-4 space-y-3">
                                    {permissions.map((permission) => (
                                      <div
                                        key={permission.id}
                                        className="flex items-center gap-3 p-3 rounded hover:bg-sidebar/80 transition-colors"
                                      >
                                        <label
                                          htmlFor={permission.id}
                                          className="text-base text-gray-200 cursor-pointer flex-1 grow"
                                        >
                                          {permission.name}
                                        </label>
                                        <Checkbox
                                          id={permission.id}
                                          checked={selectedPermissions.has(
                                            permission.id,
                                          )}
                                          onCheckedChange={() =>
                                            togglePermission(permission.id)
                                          }
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          );
                        },
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })}
        </div>

        {submitButtons}
      </form>
    </div>
  );
}

export { extractAllIds };
