"use client";

import React, { useEffect } from 'react';
import { HierarchyDesignerProps } from '../types/hierarchyTypes';
import useHierarchyData from '../hooks/useHierarchyData';
import useHierarchyConfig from '../hooks/useHierarchyConfig';
import useHierarchyStore from '../store/useHierarchyStore';
import TreeView from './tree-view/TreeView';
import ListView from './list-view/ListView';
import ControlPanel from './control-panel/ControlPanel';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorMessage from './ui/ErrorMessage';

/**
 * Main component for the Hierarchy Designer
 * 
 * @param props Component props
 * @returns React component
 */
const HierarchyDesigner: React.FC<HierarchyDesignerProps> = ({
  source,
  defaultView = 'tree',
  config: userConfig,
  onNodeSelect,
  onNodeEdit,
  onNodeDelete,
  onExport,
  className = '',
  style = {},
}) => {
  // Get data from the source
  const { data, isLoading, error, reloadData } = useHierarchyData(source);
  
  // Get configuration utilities
  const { generateConfigFromData, updateConfig } = useHierarchyConfig();
  
  // Get state from the store
  const { 
    currentView, 
    setView, 
    selectedNodeId, 
    selectNode,
    updateNode,
    deleteNode,
  } = useHierarchyStore();

  // Set the default view
  useEffect(() => {
    setView(defaultView);
  }, [defaultView, setView]);

  // Apply user configuration
  useEffect(() => {
    if (userConfig) {
      updateConfig(userConfig);
    }
  }, [userConfig, updateConfig]);

  // Generate configuration from data when it's loaded
  useEffect(() => {
    if (data && !userConfig) {
      generateConfigFromData();
    }
  }, [data, userConfig, generateConfigFromData]);

  // Handle node selection
  const handleNodeSelect = (node: HierarchyNode) => {
    selectNode(node.id);
    
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  };

  // Handle node editing
  const handleNodeEdit = (node: HierarchyNode, updates: Partial<HierarchyNode>) => {
    updateNode(node.id, updates);
    
    if (onNodeEdit) {
      onNodeEdit(node, updates);
    }
  };

  // Handle node deletion
  const handleNodeDelete = (node: HierarchyNode) => {
    deleteNode(node.id);
    
    if (onNodeDelete) {
      onNodeDelete(node);
    }
  };

  // Handle export
  const handleExport = (format: 'pdf' | 'json', exportData: any) => {
    if (onExport) {
      onExport(format, exportData);
    }
  };

  return (
    <div 
      className={`hierarchy-designer ${className}`}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        width: '100%',
        ...style 
      }}
    >
      {/* Control Panel */}
      <ControlPanel 
        currentView={currentView}
        onViewChange={setView}
        onExport={handleExport}
        onReload={reloadData}
      />
      
      {/* Content Area */}
      <div 
        className="hierarchy-designer-content"
        style={{ 
          flex: 1, 
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {isLoading && <LoadingSpinner />}
        
        {error && <ErrorMessage message={error} />}
        
        {data && !isLoading && !error && (
          <>
            {/* Tree View */}
            {currentView === 'tree' && (
              <div 
                id="hierarchy-tree-view"
                style={{ 
                  height: '100%', 
                  width: '100%',
                  display: currentView === 'tree' ? 'block' : 'none',
                }}
              >
                <TreeView 
                  data={data}
                  selectedNodeId={selectedNodeId || undefined}
                  onNodeSelect={handleNodeSelect}
                  onNodeEdit={handleNodeEdit}
                  onNodeDelete={handleNodeDelete}
                />
              </div>
            )}
            
            {/* List View */}
            {currentView === 'list' && (
              <div 
                id="hierarchy-list-view"
                style={{ 
                  height: '100%', 
                  width: '100%',
                  display: currentView === 'list' ? 'block' : 'none',
                  overflowY: 'auto',
                }}
              >
                <ListView 
                  data={data}
                  selectedNodeId={selectedNodeId || undefined}
                  onNodeSelect={handleNodeSelect}
                  onNodeEdit={handleNodeEdit}
                  onNodeDelete={handleNodeDelete}
                  onFocusInTree={(node) => {
                    selectNode(node.id);
                    setView('tree');
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HierarchyDesigner;
