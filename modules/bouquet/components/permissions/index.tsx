"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Accordion } from "@/components/ui/accordion";
import { apiClient } from "@/config/axios-config";
import { toast } from 'sonner';
import MainAccordionCategory from "./MainAccordionCategory";
import SubmitButton from "./SubmitButton";
import { 
  PermissionItem, 
  PermissionWithStatus, 
  NestedPermissionsData,
  NestedPermissionsRoot,
  PackagePermissionsRoot,
} from "./types";

// Props interface
interface PermissionsBouquetProps {
  packageId: string;
}

// Helper function to map permission type to switch type
const permissionTypeMap = new Map<string, string>([
  ['view', 'view'],
  ['update', 'edit'],
  ['delete', 'delete'],
  ['create', 'create'],
  ['export', 'export'],
  ['activate', 'activate'],
  ['list', 'list']
]);

const getSwitchTypeFromPermissionType = (permissionType: string): string | null => {
return null
};

function PermissionsBouquet({ packageId }: PermissionsBouquetProps) {
  const [permissions, setPermissions] = useState<NestedPermissionsData | null>(null);
  const [packagePermissions, setPackagePermissions] = useState<PackagePermissionsRoot | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({});
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({});
  const [numberValues, setNumberValues] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Helper function to create default permissions structure for nested data
  const createDefaultPermissions = useCallback((lookupPayload: NestedPermissionsData): NestedPermissionsData => {
    const defaultPermissions: NestedPermissionsData = {};
    
    Object.entries(lookupPayload).forEach(([mainKey, mainData]) => {
      defaultPermissions[mainKey] = {};
      
      Object.entries(mainData).forEach(([subKey, subData]) => {
        defaultPermissions[mainKey][subKey] = {};
        
        Object.entries(subData).forEach(([categoryKey, categoryData]) => {
          if (Array.isArray(categoryData)) {
            (defaultPermissions[mainKey][subKey] as any)[categoryKey] = categoryData.map((item: any) => ({
              id: item.id,
              key: item.key,
              type: item.type,
              name: item.name,
              is_active: false
            }));
          }
        });
      });
    });
    
    return defaultPermissions;
  }, []);

  // Helper function to merge lookup data with package permissions for nested structure
  const mergePermissionsData = useCallback((lookupPayload: NestedPermissionsData, packageData: any) => {
    const newActiveStates: Record<string, boolean> = {};
    const newNumberValues: Record<string, number> = {};
    const newSwitchStates: Record<string, boolean> = {};
    const mergedPermissions: NestedPermissionsData = {};
    
    Object.entries(lookupPayload).forEach(([mainKey, mainData]) => {
      mergedPermissions[mainKey] = {};
      
      Object.entries(mainData).forEach(([subKey, subData]) => {
        (mergedPermissions[mainKey] as any)[subKey] = {};
        
        Object.entries(subData).forEach(([categoryKey, categoryData]) => {
          if (Array.isArray(categoryData)) {
            const packageMainData = packageData.payload?.permissions?.[mainKey];
            const packageSubData = packageMainData?.[subKey];
            const packageCategoryData = packageSubData?.[categoryKey] || [];
            
            const mergedItems: PermissionWithStatus[] = categoryData.map((lookupItem: any) => {
              const packageItem = Array.isArray(packageCategoryData) 
                ? packageCategoryData.find((pItem: any) => pItem.id === lookupItem.id)
                : null;
              
              // Generate state keys for nested structure
              const switchId = `${subKey}-${categoryKey}-${lookupItem.type}`;
              const stateKey = `${mainKey}.${subKey}.${categoryKey}.${lookupItem.type}`;
              
              newActiveStates[stateKey] = packageItem?.is_active === true;
              newSwitchStates[switchId] = packageItem?.is_active === true;
              
              if (packageItem?.limit !== undefined && packageItem?.limit !== null) {
                newNumberValues[`${subKey}-${categoryKey}`] = packageItem.limit;
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
            
            (mergedPermissions[mainKey][subKey] as any)[categoryKey] = mergedItems;
          }
        });
      });
    });
    
    return { mergedPermissions, newActiveStates, newNumberValues, newSwitchStates };
  }, []);

  // Function to fetch lookup permissions
  const fetchLookupPermissions = useCallback(async () => {
    const response = await apiClient.get(`/role_and_permissions/permissions/lookup?package_id=${packageId}`);
    return response.data?.payload;
  }, [packageId]);

  // Function to fetch package permissions
  const fetchPackagePermissions = useCallback(async () => {
    if (!packageId) return null;
    const response = await apiClient.get(`/packages/${packageId}/permissions`);
    return response.data;
  }, [packageId]);

  // Main data fetching function
  const fetchData = useCallback(async () => {
    try {
      const lookupPayload = await fetchLookupPermissions();
      
      if (!lookupPayload || typeof lookupPayload !== 'object') {
        setPermissions(null);
        return;
      }

      if (packageId) {
        try {
          const packageData = await fetchPackagePermissions();
          
          if (packageData) {
            setPackagePermissions(packageData as PackagePermissionsRoot);
            
            const { mergedPermissions, newActiveStates, newNumberValues, newSwitchStates } = 
              mergePermissionsData(lookupPayload, packageData);
            
            setPermissions(mergedPermissions);
            setActiveStates(newActiveStates);
            setNumberValues(newNumberValues);
            setSwitchStates(newSwitchStates);
          } else {
            console.warn('No package data found');
            setPermissions(createDefaultPermissions(lookupPayload));
          }
        } catch (packageError) {
          console.error('Package API Error:', packageError);
          setPackagePermissions(null);
          setPermissions(createDefaultPermissions(lookupPayload));
        }
      } else {
        console.warn('No package ID found, cannot fetch package permissions');
        setPermissions(createDefaultPermissions(lookupPayload));
      }
    } catch (error) {
      console.error('Lookup API Error:', error);
      setPermissions(null);
      setPackagePermissions(null);
    } finally {
      setLoading(false);
    }
  }, [packageId, fetchLookupPermissions, fetchPackagePermissions, mergePermissionsData, createDefaultPermissions]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);


  const handlePermissionChange = useCallback((permissionId: string, checked: boolean) => {
    setSelectedPermissions(prev => {
      const newSelected = new Set(prev);
      checked ? newSelected.add(permissionId) : newSelected.delete(permissionId);
      return newSelected;
    });
  }, []);

  // Helper function to generate active state key for nested structure
  const generateActiveStateKey = useCallback((switchId: string): string | null => {
    // switchId format: subKey-categoryKey-type
    const parts = switchId.split('-');
    if (parts.length >= 3) {
      const subKey = parts[0];
      const categoryKey = parts[1];
      const type = parts.slice(2).join('-'); // Handle types with dashes
      
      // Find mainKey by searching through permissions
      if (permissions) {
        for (const [mainKey, mainData] of Object.entries(permissions)) {
          if (mainData[subKey]?.[categoryKey]) {
            return `${mainKey}.${subKey}.${categoryKey}.${type}`;
          }
        }
      }
    }
    return null;
  }, [permissions]);

  const handleSwitchChange = useCallback((switchId: string, checked: boolean, permissionId?: string) => {

    setSwitchStates(prev => {
      const newSwitchStates = {
        ...prev,
        [switchId]: checked
      };
      
      // Extract category info from switchId (format: subKey-categoryKey-type)
      const switchParts = switchId.split('-');
      if (switchParts.length >= 3) {
        const subKey = switchParts[0];
        const categoryKey = switchParts[1];
        
        // Find all permissions in this category to check their switch states
        if (permissions) {
          Object.entries(permissions).forEach(([mainKey, mainData]) => {
            if (mainData[subKey]?.[categoryKey]) {
              const categoryData = mainData[subKey][categoryKey];
              if (Array.isArray(categoryData)) {
                // Get all unique permission types in this category
                const availableTypes = [...new Set(categoryData.map(item => item.type))];
                
                // Check if ALL switches in this category are active
                const allSwitchesActive = availableTypes.every(type => {
                  const checkSwitchId = `${subKey}-${categoryKey}-${type}`;
                  return newSwitchStates[checkSwitchId] === true;
                });
                
                // Update checkbox state based on switch states
                if (allSwitchesActive) {
                  // If all switches are active, check all permissions in this category
                  categoryData.forEach(item => {
                    setSelectedPermissions(prev => {
                      const newSelected = new Set(prev);
                      newSelected.add(item.id);
                      return newSelected;
                    });
                  });
                } else {
                  // If not all switches are active, uncheck all permissions in this category
                  categoryData.forEach(item => {
                    setSelectedPermissions(prev => {
                      const newSelected = new Set(prev);
                      newSelected.delete(item.id);
                      return newSelected;
                    });
                  });
                }
              }
            }
          });
        }
      }
      
      return newSwitchStates;
    });
    
    const activeStateKey = generateActiveStateKey(switchId);
    
    if (activeStateKey) {
      setActiveStates(prev => ({
        ...prev,
        [activeStateKey]: checked
      }));
    }
  }, [generateActiveStateKey, permissions]);
  
  const handleNumberChange = useCallback((permissionId: string, value: number) => {
    // Validate the input value
    if (typeof value !== 'number' || isNaN(value)) {
      console.warn(`Invalid number value for permission ${permissionId}:`, value);
      return;
    }
    
    // Ensure the value is not negative
    const validatedValue = Math.max(0, Math.floor(value));
    
    // Log warning if value was adjusted
    if (validatedValue !== value) {
      console.warn(`Value for permission ${permissionId} was adjusted from ${value} to ${validatedValue}`);
    }
    
    setNumberValues(prev => ({
      ...prev,
      [permissionId]: validatedValue
    }));
  }, []);


  // Function to get permission IDs only where switches are active
  const getAllActivePermissionIds = (): string[] => {
    const activeIds: string[] = [];
    
    if (permissions) {
      Object.entries(permissions).forEach(([mainKey, mainData]) => {
        Object.entries(mainData).forEach(([subKey, subData]) => {
          Object.entries(subData).forEach(([categoryKey, categoryData]) => {
            if (Array.isArray(categoryData)) {
              categoryData.forEach((item: PermissionWithStatus) => {
                // Only collect permission IDs where switches are active
                const switchId = `${subKey}-${categoryKey}-${item.type}`;
                if (switchStates[switchId]) {
                  activeIds.push(item.id);
                }
              });
            }
          });
        });
      });
    }
    
    // Return empty array if no switches are active
    return activeIds;
  };

  // Function to submit all active permission IDs to API
   const submit = async () => {
    setSubmitting(true);
    try {
      // Get all currently active permission IDs
      const activePermissionIds = getAllActivePermissionIds();
      
      // Allow empty array to be sent to API to clear all permissions

      // Create limits array with permission_id and number for nested structure
      const limits: Array<{ permission_id: string; number: number }> = [];
      
      // Map nested structure to create permission IDs and their number values
      if (permissions) {
        Object.entries(permissions).forEach(([mainKey, mainData]) => {
          Object.entries(mainData).forEach(([subKey, subData]) => {
            Object.entries(subData).forEach(([categoryKey, categoryData]) => {
              if (Array.isArray(categoryData)) {
                // Find the view permission for this category (as per memory requirements)
                const createItem = categoryData.find(item => item.type === 'create');
                const numberKey = `${subKey}-${categoryKey}`;
                
                // If view permission exists and has a number value, add to limits
                if (createItem && numberValues[numberKey] !== undefined && numberValues[numberKey] > 0) {
                  limits.push({
                    permission_id: createItem.id,
                    number: numberValues[numberKey]
                  });
                }
              }
            });
          });
        });
      }
      
      const response = await apiClient.post(`/packages/${packageId}/assign-permissions`, {
        permissions: activePermissionIds,
        limits: limits
      });

      if (response.status === 200 || response.status === 201) {        
        try {
          toast.success('Permissions assigned successfully!');
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
      {/* Main accordion for nested structure */}
      <Accordion type="multiple" className="w-full">
        {Object.entries(permissions).map(([mainKey, mainData]) => {
          if (!mainData || Object.keys(mainData).length === 0) {
            return null;
          }

          return (
            <MainAccordionCategory
              key={mainKey}
              mainKey={mainKey}
              mainData={mainData}
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
