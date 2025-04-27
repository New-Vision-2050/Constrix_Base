"use client";

import { useCallback } from 'react';
import { HierarchyNode, HierarchyViewMode, HierarchyConfig } from '../types/hierarchyTypes';
import useHierarchyStore from '../store/useHierarchyStore';
import { exportAndDownload } from '../utils/exportUtils';

/**
 * Hook for exporting hierarchy data to different formats
 * 
 * @returns Object containing export utilities
 */
const useHierarchyExport = () => {
  const { 
    data, 
    currentView, 
    config 
  } = useHierarchyStore();

  /**
   * Export the current hierarchy data to PDF
   */
  const exportToPdf = useCallback(async () => {
    if (!data) {
      console.error('No data available to export');
      return false;
    }

    return exportAndDownload(data, 'pdf', currentView, config);
  }, [data, currentView, config]);

  /**
   * Export the current hierarchy data to JSON
   */
  const exportToJson = useCallback(() => {
    if (!data) {
      console.error('No data available to export');
      return false;
    }

    return exportAndDownload(data, 'json');
  }, [data]);

  /**
   * Export a specific node and its children to PDF
   */
  const exportNodeToPdf = useCallback(async (nodeId: string) => {
    if (!data) {
      console.error('No data available to export');
      return false;
    }

    // Find the node by ID
    const findNode = (node: HierarchyNode, id: string): HierarchyNode | null => {
      if (node.id === id) {
        return node;
      }

      if (!node.children) {
        return null;
      }

      for (const child of node.children) {
        const found = findNode(child, id);
        if (found) {
          return found;
        }
      }

      return null;
    };

    const nodeToExport = findNode(data, nodeId);
    
    if (!nodeToExport) {
      console.error(`Node with ID ${nodeId} not found`);
      return false;
    }

    return exportAndDownload(nodeToExport, 'pdf', currentView, config);
  }, [data, currentView, config]);

  /**
   * Export a specific node and its children to JSON
   */
  const exportNodeToJson = useCallback((nodeId: string) => {
    if (!data) {
      console.error('No data available to export');
      return false;
    }

    // Find the node by ID
    const findNode = (node: HierarchyNode, id: string): HierarchyNode | null => {
      if (node.id === id) {
        return node;
      }

      if (!node.children) {
        return null;
      }

      for (const child of node.children) {
        const found = findNode(child, id);
        if (found) {
          return found;
        }
      }

      return null;
    };

    const nodeToExport = findNode(data, nodeId);
    
    if (!nodeToExport) {
      console.error(`Node with ID ${nodeId} not found`);
      return false;
    }

    return exportAndDownload(nodeToExport, 'json');
  }, [data]);

  return {
    exportToPdf,
    exportToJson,
    exportNodeToPdf,
    exportNodeToJson,
  };
};

export default useHierarchyExport;