import { useCallback, useState, useEffect } from "react";
import { RolePermissions } from "../type";

export function useRoleCheckboxes(allTypes: string[] , allPermissions: RolePermissions) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const allPermissionsKeys = Object.values(allPermissions.permissions)
    .flatMap((group) => Object.values(group).flatMap((items) => items.map((item) => item.key)));

  const handleTypeChange = useCallback((type: string) => {
    const allKeys: string[] = [];
    Object.values(allPermissions.permissions).forEach((group) => {
      Object.values(group).forEach((items) => {
        items.forEach((item) => {
          if (item.type === type) {
            allKeys.push(item.key);
          }
        });
      });
    });
    setSelectedPermissions((prev) => {
      const allSelected = allKeys.every((key) => prev.includes(key));
      return allSelected ? prev.filter((key) => !allKeys.includes(key)) : Array.from(new Set([...prev, ...allKeys]));
    });
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, [allPermissions]);

  const handleSelectAll = useCallback(() => {
    setSelectedTypes((prev) =>
      prev.length === allTypes.length ? [] : allTypes
    );
    setSelectedPermissions((prev) =>
      prev.length === allPermissionsKeys.length ? [] : allPermissionsKeys
    );
  }, [allTypes, allPermissionsKeys]);

  const allChecked = selectedPermissions.length === allPermissionsKeys.length;
  const isIndeterminate = selectedPermissions.length > 0 && !allChecked;

  const isTypeSelected = useCallback((type: string) => {
    const typeKeys: string[] = [];
    Object.values(allPermissions.permissions).forEach((group) => {
      Object.values(group).forEach((items) => {
        items.forEach((item) => {
          if (item.type === type) {
            typeKeys.push(item.key);
          }
        });
      });
    });
    return typeKeys.length > 0 && typeKeys.every((key) => selectedPermissions.includes(key));
  }, [allPermissions, selectedPermissions]);

  const handlePermissionChange = useCallback((key: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  const handleSelectAllPermissions = useCallback((keys: string[]) => {
    setSelectedPermissions((prev) => {
      const allSelected = keys.every((key) => prev.includes(key));
      return allSelected ? prev.filter((key) => !keys.includes(key)) : Array.from(new Set([...prev, ...keys]));
    });
  }, []);

  const isPermissionSelected = useCallback((key: string) => selectedPermissions.includes(key), [selectedPermissions]);

  const isPermissionsIndeterminate = useCallback((keys: string[]) => {
    const selectedCount = keys.filter((key) => selectedPermissions.includes(key)).length;
    return selectedCount > 0 && selectedCount < keys.length;
  }, [selectedPermissions]);

  const areAllPermissionsSelected = useCallback((keys: string[]) => {
    return keys.every((key) => selectedPermissions.includes(key));
  }, [selectedPermissions]);

  useEffect(() => {
    const typeToItems: Record<string, Array<{ is_active: boolean; key: string }>> = {};
    Object.values(allPermissions.permissions).forEach((group) => {
      Object.values(group).forEach((items) => {
        items.forEach((item) => {
          if (!typeToItems[item.type]) typeToItems[item.type] = [];
          typeToItems[item.type].push(item);
        });
      });
    });

    const typesWithAllActive = Object.entries(typeToItems)
      .filter(([type, items]) => items.length > 0 && items.every((item) => item.is_active))
      .map(([type]) => type);
    setSelectedTypes(typesWithAllActive);

    const allActiveKeys = Object.values(typeToItems)
      .flat()
      .filter((item) => item.is_active)
      .map((item) => item.key);
    setSelectedPermissions(allActiveKeys);
  }, []);

  return {
    selectedTypes,
    handleTypeChange,
    handleSelectAll,
    allChecked,
    isIndeterminate,
    selectedPermissions,
    handlePermissionChange,
    handleSelectAllPermissions,
    isPermissionSelected,
    isPermissionsIndeterminate,
    areAllPermissionsSelected,
    isTypeSelected
  };
}