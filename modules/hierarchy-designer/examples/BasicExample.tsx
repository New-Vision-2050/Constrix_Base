"use client";

import React, { useState } from 'react';
import { HierarchyDesigner } from '..';
import { HierarchyNode } from '../types/hierarchyTypes';

/**
 * Basic example of using the Hierarchy Designer
 */
const BasicExample: React.FC = () => {
  // Sample data
  const [data] = useState<HierarchyNode>({
    id: 'root',
    name: 'Project Structure',
    description: 'Complete project structure and organization',
    status: 'active',
    createdAt: new Date().toISOString(),
    children: [
      {
        id: 'frontend',
        name: 'Frontend',
        description: 'Frontend components and pages',
        status: 'active',
        createdAt: new Date().toISOString(),
        tags: ['react', 'typescript', 'ui'],
        children: [
          {
            id: 'components',
            name: 'Components',
            description: 'Reusable UI components',
            status: 'active',
            createdAt: new Date().toISOString(),
            children: []
          },
          {
            id: 'pages',
            name: 'Pages',
            description: 'Application pages',
            status: 'active',
            createdAt: new Date().toISOString(),
            children: []
          }
        ]
      },
      {
        id: 'backend',
        name: 'Backend',
        description: 'Backend services and APIs',
        status: 'active',
        createdAt: new Date().toISOString(),
        tags: ['node', 'express', 'api'],
        children: [
          {
            id: 'api',
            name: 'API Routes',
            description: 'API endpoints',
            status: 'active',
            createdAt: new Date().toISOString(),
            children: []
          },
          {
            id: 'models',
            name: 'Data Models',
            description: 'Database models and schemas',
            status: 'pending',
            createdAt: new Date().toISOString(),
            children: []
          }
        ]
      }
    ]
  });

  // Handle node selection
  const handleNodeSelect = (node: HierarchyNode) => {
    console.log('Selected node:', node);
  };

  // Handle node editing
  const handleNodeEdit = (node: HierarchyNode, updates: Partial<HierarchyNode>) => {
    console.log('Edit node:', node.id, updates);
  };

  // Handle node deletion
  const handleNodeDelete = (node: HierarchyNode) => {
    console.log('Delete node:', node.id);
  };

  // Handle export
  const handleExport = (format: 'pdf' | 'json', exportData: any) => {
    console.log(`Exported as ${format}:`, exportData);
  };

  return (
    <div style={{ height: '600px', width: '100%', padding: '20px' }}>
      <h1>Hierarchy Designer Example</h1>
      <p>This example demonstrates the basic usage of the Hierarchy Designer component.</p>
      
      <div style={{ height: '500px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
        <HierarchyDesigner
          source={{ type: 'json', data }}
          defaultView="tree"
          onNodeSelect={handleNodeSelect}
          onNodeEdit={handleNodeEdit}
          onNodeDelete={handleNodeDelete}
          onExport={handleExport}
          config={{
            expandedFields: ['description', 'tags', 'createdAt'],
            treeOptions: {
              showMinimap: true,
              allowEditing: true,
              zoomable: true,
            },
            listOptions: {
              expandable: true,
              showActions: true,
              showStatus: true,
            }
          }}
        />
      </div>
    </div>
  );
};

export default BasicExample;