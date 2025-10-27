"use client";
import React, { useMemo, useEffect } from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PermissionTableHeader from "./PermissionTableHeader";
import PermissionRow from "./PermissionRow";
import { SubAccordionPermissions, PermissionWithStatus } from "./types";

interface SubAccordionCategoryProps {
  mainKey: string;
  subKey: string;
  subData: SubAccordionPermissions;
  selectedPermissions: Set<string>;
  switchStates: Record<string, boolean>;
  activeStates: Record<string, boolean>;
  numberValues: Record<string, number>;
  onPermissionChange: (permissionId: string, checked: boolean) => void;
  onSwitchChange: (switchId: string, checked: boolean) => void;
  onNumberChange: (subKey: string, value: number) => void;
}

function SubAccordionCategory({
  mainKey,
  subKey,
  subData,
  selectedPermissions,
  switchStates,
  activeStates,
  numberValues,
  onPermissionChange,
  onSwitchChange,
  onNumberChange,
}: SubAccordionCategoryProps) {
  // Get all permission IDs for select all functionality
  const allPermissionIds = useMemo(() => {
    const ids: string[] = [];
    Object.entries(subData).forEach(([categoryKey, categoryData]) => {
      if (categoryData && Array.isArray(categoryData) && categoryData.length > 0) {
        categoryData.forEach(permission => {
          ids.push(permission.id);
        });
      }
    });
    return ids;
  }, [subData]);
  
  // Check if all permissions in this sub accordion are selected
  const allSelected = useMemo(() => {
    return allPermissionIds.length > 0 && allPermissionIds.every(id => selectedPermissions.has(id));
  }, [allPermissionIds, selectedPermissions]);

  const handleSelectAll = useMemo(() => {
    return (checked: boolean) => {
      // Handle permission selection
      allPermissionIds.forEach(id => {
        if (checked && !selectedPermissions.has(id)) {
          onPermissionChange(id, true);
        } else if (!checked && selectedPermissions.has(id)) {
          onPermissionChange(id, false);
        }
      });
      
      // Handle switch activation for all categories and permission types
      Object.entries(subData).forEach(([categoryKey, categoryValue]) => {
        if (Array.isArray(categoryValue)) {
          // Get all unique permission types in this category
          const availableTypes = [...new Set(categoryValue.map(item => item.type))];
          
          // Activate/deactivate switches for all available permission types
          availableTypes.forEach(type => {
            const switchId = `${subKey}-${categoryKey}-${type}`;
            onSwitchChange(switchId, checked);
          });
        }
      });
    };
  }, [allPermissionIds, selectedPermissions, onPermissionChange, onSwitchChange, subData, subKey]);

  // Auto-check permissions when all switches in a category are active
  useEffect(() => {
    Object.entries(subData).forEach(([categoryKey, categoryValue]) => {
      if (Array.isArray(categoryValue)) {
        // Get all unique permission types in this category
        const availableTypes = [...new Set(categoryValue.map(item => item.type))];
        
        // Check if all switches for this category are active
        const allSwitchesActive = availableTypes.every(type => {
          const switchId = `${subKey}-${categoryKey}-${type}`;
          return switchStates[switchId] === true;
        });
        
        // If all switches are active, auto-check all permissions in this category
        if (allSwitchesActive && availableTypes.length > 0) {
          categoryValue.forEach(item => {
            if (!selectedPermissions.has(item.id)) {
              onPermissionChange(item.id, true);
            }
          });
        }
      }
    });
  }, [switchStates, subData, subKey, selectedPermissions, onPermissionChange]);

  return (
    <AccordionItem value={`${mainKey}-${subKey}`} className="border rounded-lg">
      <AccordionTrigger className="px-4 py-2 text-base font-medium rounded-t-lg">
        {subKey}
      </AccordionTrigger>
      <AccordionContent className="px-4 py-3">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-transparent">
            <PermissionTableHeader 
              allSelected={allSelected}
              onSelectAll={handleSelectAll}
            />
            <tbody>
              {/* One row per category */}
              {(() => {
                
                // Group permissions by category - one row per category
                const categoriesWithPermissions: { categoryKey: string; permissions: PermissionWithStatus[] }[] = [];
                
                Object.entries(subData).forEach(([categoryKey, categoryValue]) => {
                  const categoryPermissions: PermissionWithStatus[] = [];
                  
                  if (Array.isArray(categoryValue)) {
                    // Direct array of permissions
                    categoryPermissions.push(...categoryValue);
                  } else if (categoryValue && typeof categoryValue === 'object') {
                    // Nested object with subcategories
                    Object.entries(categoryValue).forEach(([subCategoryKey, permissionsArray]) => {
                      if (Array.isArray(permissionsArray)) {
                        categoryPermissions.push(...permissionsArray);
                      }
                    });
                  }
                  
                  if (categoryPermissions.length > 0) {
                    categoriesWithPermissions.push({ categoryKey, permissions: categoryPermissions });
                  }
                });
                
                return categoriesWithPermissions.map(({ categoryKey, permissions }, index) => {
                  return (
                    <PermissionRow
                      key={categoryKey}
                      mainKey={mainKey}
                      subKey={subKey}
                      categoryKey={categoryKey}
                      subItems={permissions}
                      selectedPermissions={selectedPermissions}
                      switchStates={switchStates}
                      activeStates={activeStates}
                      numberValues={numberValues}
                      onPermissionChange={onPermissionChange}
                      onSwitchChange={onSwitchChange}
                      onNumberChange={onNumberChange}
                    />
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default SubAccordionCategory;
