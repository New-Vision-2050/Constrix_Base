"use client";

import { useCallback } from 'react';
import { HierarchyConfig, HierarchyNode } from '../types/hierarchyTypes';
import useHierarchyStore from '../store/useHierarchyStore';
import { flattenHierarchy, getUniqueFieldValues } from '../utils/hierarchyUtils';

/**
 * Hook for managing hierarchy configuration
 * 
 * @returns Object containing configuration utilities
 */
const useHierarchyConfig = () => {
  const { 
    config, 
    updateConfig, 
    data 
  } = useHierarchyStore();

  /**
   * Generate a configuration based on the current data
   * This analyzes the data structure and creates a suitable configuration
   */
  const generateConfigFromData = useCallback(() => {
    if (!data) return;

    // Flatten the hierarchy to analyze all nodes
    const allNodes = flattenHierarchy(data);
    
    if (allNodes.length === 0) return;
    
    // Get a sample node (first node)
    const sampleNode = allNodes[0];
    
    // Extract all fields from the sample node
    const allFields = Object.keys(sampleNode).filter(
      key => !['id', 'name', 'children'].includes(key)
    );
    
    // Determine which fields are common across all nodes
    const commonFields = allFields.filter(field => 
      allNodes.every(node => field in node)
    );
    
    // Determine which fields have multiple unique values (good for filtering)
    const filterableFields = commonFields.filter(field => {
      const uniqueValues = getUniqueFieldValues(allNodes, field);
      return uniqueValues.length > 1 && uniqueValues.length < allNodes.length / 2;
    });
    
    // Create a new configuration
    const newConfig: Partial<HierarchyConfig> = {
      expandedFields: commonFields,
      searchFields: ['name', 'description', ...commonFields.filter(f => typeof sampleNode[f] === 'string')],
      filterFields: filterableFields,
    };
    
    // Update the configuration
    updateConfig(newConfig);
  }, [data, updateConfig]);

  /**
   * Update specific configuration options
   */
  const updateConfigOptions = useCallback((updates: Partial<HierarchyConfig>) => {
    updateConfig(updates);
  }, [updateConfig]);

  /**
   * Get field metadata for all available fields in the data
   * This is useful for building dynamic field selectors
   */
  const getFieldMetadata = useCallback(() => {
    if (!data) return [];

    const allNodes = flattenHierarchy(data);
    if (allNodes.length === 0) return [];

    // Get all unique fields across all nodes
    const allFields = new Set<string>();
    allNodes.forEach(node => {
      Object.keys(node).forEach(key => {
        if (!['id', 'children'].includes(key)) {
          allFields.add(key);
        }
      });
    });

    // Create metadata for each field
    return Array.from(allFields).map(field => {
      // Get a sample value
      const sampleNode = allNodes.find(node => field in node);
      const sampleValue = sampleNode ? sampleNode[field] : undefined;
      
      // Determine field type
      let type = 'string';
      if (typeof sampleValue === 'number') type = 'number';
      if (typeof sampleValue === 'boolean') type = 'boolean';
      if (Array.isArray(sampleValue)) type = 'array';
      if (sampleValue instanceof Date) type = 'date';
      
      // Calculate how many nodes have this field
      const nodesWithField = allNodes.filter(node => field in node).length;
      const coverage = (nodesWithField / allNodes.length) * 100;
      
      return {
        name: field,
        type,
        coverage,
        uniqueValues: getUniqueFieldValues(allNodes, field).length,
        isCommon: coverage > 80, // Field exists in more than 80% of nodes
      };
    });
  }, [data]);

  return {
    config,
    updateConfig: updateConfigOptions,
    generateConfigFromData,
    getFieldMetadata,
  };
};

export default useHierarchyConfig;