"use client";

import React, { useState } from 'react';
import { ListViewProps, HierarchyNode } from '../../types/hierarchyTypes';
import useHierarchyStore from '../../store/useHierarchyStore';
import ListViewItem from './ListViewItem';

/**
 * List view component for displaying hierarchical data as an expandable list
 * 
 * @param props Component props
 * @returns React component
 */
const ListView: React.FC<ListViewProps> = ({
  data,
  options,
  expandedFields,
  onNodeSelect,
  onNodeEdit,
  onNodeDelete,
  onFocusInTree,
  selectedNodeId,
  className = '',
  style = {},
}) => {
  const { config, searchTerm, filters } = useHierarchyStore();
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

  // Combine options with config
  const listOptions = {
    ...config.listOptions,
    ...options,
  };

  // Use expandedFields from props or config
  const fieldsToShow = expandedFields || config.expandedFields || [];

  // Toggle node expansion
  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedNodes(prev => 
      prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  // Check if a node matches the search term
  const matchesSearch = (node: HierarchyNode): boolean => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    // Check name and description
    if (
      node.name.toLowerCase().includes(searchLower) ||
      (node.description && node.description.toLowerCase().includes(searchLower))
    ) {
      return true;
    }
    
    // Check other fields
    for (const field of fieldsToShow) {
      const value = node[field];
      if (value && typeof value === 'string' && value.toLowerCase().includes(searchLower)) {
        return true;
      }
    }
    
    // Check children recursively
    if (node.children) {
      for (const child of node.children) {
        if (matchesSearch(child)) {
          return true;
        }
      }
    }
    
    return false;
  };

  // Check if a node matches the filters
  const matchesFilters = (node: HierarchyNode): boolean => {
    if (Object.keys(filters).length === 0) return true;
    
    for (const [field, value] of Object.entries(filters)) {
      if (value === undefined || value === null) continue;
      
      const nodeValue = node[field];
      
      // Skip if the node doesn't have this field
      if (nodeValue === undefined) {
        return false;
      }
      
      // Handle array values (like tags)
      if (Array.isArray(nodeValue)) {
        if (!nodeValue.includes(value)) {
          return false;
        }
        continue;
      }
      
      // Handle string values
      if (typeof nodeValue === 'string' && typeof value === 'string') {
        if (!nodeValue.toLowerCase().includes(value.toLowerCase())) {
          return false;
        }
        continue;
      }
      
      // Handle exact matches for other types
      if (nodeValue !== value) {
        return false;
      }
    }
    
    return true;
  };

  // Recursively render nodes
  const renderNodes = (nodes: HierarchyNode[], level = 0): React.ReactNode => {
    if (!nodes || nodes.length === 0) return null;
    
    return nodes.map(node => {
      // Skip nodes that don't match search or filters
      if (searchTerm && !matchesSearch(node)) return null;
      if (!matchesFilters(node)) return null;
      
      const isExpanded = expandedNodes.includes(node.id);
      
      return (
        <React.Fragment key={node.id}>
          <ListViewItem
            node={node}
            level={level}
            isExpanded={isExpanded}
            isSelected={selectedNodeId === node.id}
            expandedFields={fieldsToShow}
            options={listOptions}
            onToggleExpand={() => toggleNodeExpansion(node.id)}
            onSelect={onNodeSelect ? () => onNodeSelect(node) : undefined}
            onEdit={onNodeEdit ? (updates: Partial<HierarchyNode>) => onNodeEdit(node, updates) : undefined}
            onDelete={onNodeDelete ? () => onNodeDelete(node) : undefined}
            onFocusInTree={onFocusInTree ? () => onFocusInTree(node) : undefined}
          />
          
          {/* Render children if expanded */}
          {isExpanded && node.children && (
            <div className="list-view-children">
              {renderNodes(node.children, level + 1)}
            </div>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <div 
      className={`hierarchy-list-view ${className}`}
      style={{ 
        height: '100%', 
        width: '100%',
        overflow: 'auto',
        ...style 
      }}
    >
      <div className="list-view-container">
        {renderNodes([data])}
      </div>
    </div>
  );
};

export default ListView;