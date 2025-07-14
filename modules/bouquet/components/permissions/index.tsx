"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Accordion } from "@/components/ui/accordion";
import { apiClient } from "@/config/axios-config";
import { toast } from 'sonner';
import PermissionCategory from "./PermissionCategory";
import SubmitButton from "./SubmitButton";
import { 
  PermissionItem, 
  PermissionWithStatus, 
  PermissionsData, 
  Root, 
} from "./types";

// Props interface
interface PermissionsBouquetProps {
  packageId: string;
}

// Helper function to map permission type to switch type
const getSwitchTypeFromPermissionType = (permissionType: string): string | null => {
  const typeMap: Record<string, string> = {
    'view': 'view',
    'update': 'edit',
    'delete': 'delete',
    'create': 'create',
    'export': 'export',
    'activate': 'activate',
    'list': 'list'
  };
  return typeMap[permissionType] || null;
};

function PermissionsBouquet({ packageId }: PermissionsBouquetProps) {
  const [permissions, setPermissions] = useState<PermissionsData | null>(null);
  const [packagePermissions, setPackagePermissions] = useState<Root | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({});
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({});
  const [numberValues, setNumberValues] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lookupResponse = await apiClient.get(`/role_and_permissions/permissions/lookup?package_id=${packageId}`);
        const lookupPayload = lookupResponse.data?.payload;
        
        if (!lookupPayload || typeof lookupPayload !== 'object') {
          setPermissions(null);
          return;
        }

        if (packageId) {
          try {
            const packageResponse = await apiClient.get(`/packages/${packageId}/permissions`);
            const packageData = packageResponse.data;
            
            if (packageData) {
              setPackagePermissions(packageData as Root);
              
              const newActiveStates: Record<string, boolean> = {};
              const newNumberValues: Record<string, number> = {};
              const newSwitchStates: Record<string, boolean> = {};
              const mergedPermissions: PermissionsData = {};
              
              // Merge lookup data with package permissions data
              Object.entries(lookupPayload).forEach(([categoryKey, lookupCategoryData]) => {
                if (lookupCategoryData && typeof lookupCategoryData === 'object') {
                  mergedPermissions[categoryKey] = {};
                  
                  Object.entries(lookupCategoryData).forEach(([subKey, lookupItems]) => {
                    if (Array.isArray(lookupItems)) {
                      // Get corresponding package permissions for this category/subKey
                      const packageCategoryData = packageData.payload?.permissions?.[categoryKey];
                      const packageSubItems = packageCategoryData?.[subKey] || [];
                      
                      // Create merged items with is_active status
                      const mergedItems: PermissionWithStatus[] = lookupItems.map((lookupItem: any) => {
                        // Find corresponding package item
                        const packageItem = Array.isArray(packageSubItems) 
                          ? packageSubItems.find((pItem: any) => pItem.id === lookupItem.id)
                          : null;
                        
                        const switchType = getSwitchTypeFromPermissionType(lookupItem.type);
                        if (switchType) {
                          const stateKey = `${categoryKey}.${subKey}.${switchType}`;
                          const switchId = `${subKey}-${switchType}`;
                          newActiveStates[stateKey] = packageItem?.is_active === true;
                          newSwitchStates[switchId] = packageItem?.is_active === true;
                        }
                        
                        // Extract limit values for each subKey
                        if (packageItem?.limit !== undefined && packageItem?.limit !== null) {
                          newNumberValues[subKey] = packageItem.limit;
                        }
                        
                        return {
                          id: lookupItem.id,
                          key: lookupItem.key,
                          type: lookupItem.type,
                          name: lookupItem.name,
                          is_active: packageItem?.is_active || false,
                          limit: packageItem?.limit
                        };
                      });
                      
                      mergedPermissions[categoryKey][subKey] = mergedItems;
                    }
                  });
                }
              });
              
              setPermissions(mergedPermissions);
              setActiveStates(newActiveStates);
              setNumberValues(newNumberValues);
              setSwitchStates(newSwitchStates);
            } else {
              console.warn('No package data found');
              // If no package data, create permissions structure with all is_active = false
              const defaultPermissions: PermissionsData = {};
              Object.entries(lookupPayload).forEach(([categoryKey, lookupCategoryData]) => {
                if (lookupCategoryData && typeof lookupCategoryData === 'object') {
                  defaultPermissions[categoryKey] = {};
                  Object.entries(lookupCategoryData).forEach(([subKey, lookupItems]) => {
                    if (Array.isArray(lookupItems)) {
                      defaultPermissions[categoryKey][subKey] = lookupItems.map((item: any) => ({
                        id: item.id,
                        key: item.key,
                        type: item.type,
                        name: item.name,
                        is_active: false
                      }));
                    }
                  });
                }
              });
              setPermissions(defaultPermissions);
            }
          } catch (packageError) {
            console.error('Package API Error:', packageError);
            setPackagePermissions(null);
            // Create default permissions structure on error
            const defaultPermissions: PermissionsData = {};
            Object.entries(lookupPayload).forEach(([categoryKey, lookupCategoryData]) => {
              if (lookupCategoryData && typeof lookupCategoryData === 'object') {
                defaultPermissions[categoryKey] = {};
                Object.entries(lookupCategoryData).forEach(([subKey, lookupItems]) => {
                  if (Array.isArray(lookupItems)) {
                    defaultPermissions[categoryKey][subKey] = lookupItems.map((item: any) => ({
                      id: item.id,
                      key: item.key,
                      type: item.type,
                      name: item.name,
                      is_active: false
                    }));
                  }
                });
              }
            });
            setPermissions(defaultPermissions);
          }
        } else {
          console.warn('No package ID found, cannot fetch package permissions');
          // Create default permissions structure without package ID
          const defaultPermissions: PermissionsData = {};
          Object.entries(lookupPayload).forEach(([categoryKey, lookupCategoryData]) => {
            if (lookupCategoryData && typeof lookupCategoryData === 'object') {
              defaultPermissions[categoryKey] = {};
              Object.entries(lookupCategoryData).forEach(([subKey, lookupItems]) => {
                if (Array.isArray(lookupItems)) {
                  defaultPermissions[categoryKey][subKey] = lookupItems.map((item: any) => ({
                    id: item.id,
                    key: item.key,
                    type: item.type,
                    name: item.name,
                    is_active: false
                  }));
                }
              });
            }
          });
          setPermissions(defaultPermissions);
        }
      } catch (error) {
        console.error('Lookup API Error:', error);
        setPermissions(null);
        setPackagePermissions(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [packageId, refreshTrigger]);


  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setSelectedPermissions(prev => {
      const newSelected = new Set(prev);
      checked ? newSelected.add(permissionId) : newSelected.delete(permissionId);
      return newSelected;
    });
  };

  const handleSwitchChange = (switchId: string, checked: boolean, permissionId?: string) => {
    setSwitchStates(prev => ({
      ...prev,
      [switchId]: checked
    }));
    
    const [subKey, switchType] = switchId.split('-');
    
    let categoryKey = '';
    
    if (permissions) {
      Object.entries(permissions).forEach(([catKey, catData]) => {
        if (catData && typeof catData === 'object' && catData[subKey]) {
          categoryKey = catKey;
        }
      });
    }
    
    if (categoryKey) {
      const activeStateKey = `${categoryKey}.${subKey}.${switchType}`;
      setActiveStates(prev => ({
        ...prev,
        [activeStateKey]: checked
      }));
    }
    

  };
  
  const handleNumberChange = (permissionId: string, value: number) => {
    // Update number values state
    setNumberValues(prev => ({
      ...prev,
      [permissionId]: value
    }));
    

  };

  // Function to get all currently active permission IDs
  const getAllActivePermissionIds = (): string[] => {
    const activeIds: string[] = [];
    
    if (permissions && packagePermissions?.payload.permissions) {
      Object.entries(permissions).forEach(([categoryKey, categoryData]) => {
        if (categoryData && typeof categoryData === 'object') {
          Object.entries(categoryData).forEach(([subKey, subItems]) => {
            if (Array.isArray(subItems)) {
              subItems.forEach((item: PermissionItem) => {
                const switchType = getSwitchTypeFromPermissionType(item.type);
                if (switchType) {
                  const stateKey = `${categoryKey}.${subKey}.${switchType}`;
                  if (activeStates[stateKey]) {
                    activeIds.push(item.id);
                  }
                }
              });
            }
          });
        }
      });
    }
    
    return activeIds;
  };

  // Function to submit all active permission IDs to API
   const submit = async () => {
    setSubmitting(true);
    try {
      // Get all currently active permission IDs
      const activePermissionIds = getAllActivePermissionIds();
      
      if (activePermissionIds.length === 0) {
        toast.warning('No permissions selected');
        setSubmitting(false);
        return;
      }

      // Create limits array with permission_id and number
      const limits: Array<{ permission_id: string; number: number }> = [];
      
      // Map subKey to create permission IDs and their number values
      if (permissions) {
        Object.entries(permissions).forEach(([categoryKey, categoryData]) => {
          if (categoryData && typeof categoryData === 'object') {
            Object.entries(categoryData).forEach(([subKey, subItems]) => {
              if (Array.isArray(subItems)) {
                // Find the view permission for this subKey (as per memory requirements)
                const viewItem = subItems.find(item => item.type === 'view');
                
                // If view permission exists and has a number value, add to limits
                if (viewItem && numberValues[subKey] !== undefined && numberValues[subKey] > 0) {
                  limits.push({
                    permission_id: viewItem.id,
                    number: numberValues[subKey]
                  });
                }
              }
            });
          }
        });
      }
      
      const response = await apiClient.post(`/packages/${packageId}/assign-permissions`, {
        permissions: activePermissionIds,
        limits: limits
      });

      if (response.status === 200 || response.status === 201) {        
        try {
          toast.success('Permissions assigned successfully!');
          // Reset changed permissions after successful submission
          activePermissionIds.length = 0;
          // Trigger useEffect to refresh data
          setRefreshTrigger(prev => prev + 1);
          
        } catch (e) {
          console.error('Toast method 1 failed:', e);
        }
      } else {
        throw new Error('Failed to assign permissions');
      }
    } catch (error) {
      console.error('Error assigning permissions:', error);
      toast.error('Failed to assign permissions. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  // Error state
  if (!permissions) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">Error loading permissions</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* One Accordion per payload key */}
      <Accordion type="multiple" className="w-full">
        {Object.entries(permissions).map(([categoryKey, categoryData]) => {
          if (!categoryData || Object.keys(categoryData).length === 0) {
            return null;
          }

          return (
            <PermissionCategory
              key={categoryKey}
              categoryKey={categoryKey}
              categoryData={categoryData}
              selectedPermissions={selectedPermissions}
              switchStates={switchStates}
              activeStates={activeStates}
              numberValues={numberValues}
              onPermissionChange={handlePermissionChange}
              onSwitchChange={handleSwitchChange}
              onNumberChange={handleNumberChange}
            />
          );
        })}
      </Accordion>
      
      <SubmitButton
        onSubmit={submit}
        submitting={submitting}
      /> 
    </div>
  );
}

export default PermissionsBouquet;
