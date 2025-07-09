import AutoHeight from "@/components/animation/auto-height";
import { useTranslations } from "next-intl";
import React from "react";
import { PermissionsGroup } from "../type";
import { Checkbox } from "@/modules/table/components/ui/checkbox";
import { Label } from "@/modules/table/components/ui/label";

export interface PermissionMatrixProps {
  permission: PermissionsGroup;
  name: string;
  allStaticPermissionTypes: string[];
  handlePermissionChange: (key: string) => void;
  areAllPermissionsSelected: (keys: string[]) => boolean;
  isPermissionsIndeterminate: (keys: string[]) => boolean;
  handleSelectAllPermissions: (keys: string[]) => void;
  isPermissionSelected: (key: string) => boolean;
}

const PermissionMatrix = ({
  permission,
  name,
  allStaticPermissionTypes,
  handlePermissionChange,
  areAllPermissionsSelected,
  isPermissionsIndeterminate,
  handleSelectAllPermissions,
  isPermissionSelected
}: PermissionMatrixProps) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = React.useState(true);
  const permissionKeys = Object.values(permission).flatMap((items) =>
    items.map((item) => item.key)
  );
  const isAllChecked = areAllPermissionsSelected(permissionKeys);
  const isIndeterminate = isPermissionsIndeterminate(permissionKeys);

  return (
    <div className="flex flex-col gap-2 pb-4">
      <div className="flex items-center gap-2 px-8 py-7 bg-sidebar rounded-2xl">
        <Checkbox
          checked={
            isAllChecked ? true : isIndeterminate ? "indeterminate" : false
          }
          onCheckedChange={() => handleSelectAllPermissions(permissionKeys)}
        />
        <Label className="text-base">{name}</Label>
        <div className="flex-1" />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ml-2 p-1"
          aria-label={isOpen ? "إخفاء التفاصيل" : "عرض التفاصيل"}
          type="button"
        >
          {isOpen ? (
            <span className="text-xl">&minus;</span>
          ) : (
            <span className="text-xl">+</span>
          )}
        </button>
      </div>
      <AutoHeight condition={isOpen}>
        <div className="overflow-x-auto bg-sidebar px-8 py-7 rounded-2xl">
          <table className="min-w-full border-separate border-spacing-y-1">
            <thead>
              <tr>
                <th
                  className="text-right font-medium text-base w-full whitespace-nowrap"
                  style={{ width: "100%" }}
                >
                  الصلاحيات
                </th>
                {allStaticPermissionTypes.map((role, idx) => (
                  <th
                    key={idx}
                    className="px-2 py-1 text-center font-medium text-base whitespace-nowrap"
                  >
                    {t(`RoleTypes.${role}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(permission).map(([key, permission]) => (
                <tr key={key}>
                  <td
                    className="text-right text-sm w-full whitespace-nowrap"
                    style={{ width: "100%" }}
                  >
                    {key}
                  </td>
                {allStaticPermissionTypes.map((role, idx) => {
                  const item = permission.find((perm) => perm.type === role);
                  if (item) {
                    return (
                      <td key={idx} className="px-2 py-1 text-center">
                        <Checkbox
                          id={item.key}
                          checked={isPermissionSelected(item.key)}
                          onCheckedChange={() => handlePermissionChange(item.key)}
                        />
                      </td>
                    );
                  } else {
                    return (
                      <td key={idx} className="px-2 py-1 text-center">
                        <Checkbox id={role} checked={false} disabled />
                      </td>
                    );
                  }
                })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AutoHeight>
    </div>
  );
};

export default PermissionMatrix;
