import React from 'react';
import { HierarchyDesigner } from '..';
import { HierarchyConfig } from '../types/hierarchyTypes';

/**
 * Sample JSON data for demonstration
 */
const sampleHierarchyData = {
  id: 'root',
  name: 'Company Organization',
  description: 'Complete company organizational structure',
  status: 'active',
  createdAt: '2023-01-15T08:00:00Z',
  updatedAt: '2023-06-22T14:30:00Z',
  tags: ['organization', 'company', 'structure'],
  children: [
    {
      id: 'dept-1',
      name: 'Executive Leadership',
      description: 'Executive leadership team',
      status: 'active',
      createdAt: '2023-01-15T08:00:00Z',
      updatedAt: '2023-05-10T11:20:00Z',
      tags: ['leadership', 'executive'],
      children: [
        {
          id: 'role-1',
          name: 'Chief Executive Officer',
          description: 'CEO of the company',
          status: 'active',
          createdAt: '2023-01-15T08:00:00Z',
          updatedAt: '2023-04-05T09:15:00Z',
          employeeName: 'John Smith',
          employeeId: 'EMP001',
          email: 'john.smith@example.com',
          children: []
        },
        {
          id: 'role-2',
          name: 'Chief Technology Officer',
          description: 'CTO of the company',
          status: 'active',
          createdAt: '2023-01-15T08:00:00Z',
          updatedAt: '2023-03-20T14:45:00Z',
          employeeName: 'Sarah Johnson',
          employeeId: 'EMP002',
          email: 'sarah.johnson@example.com',
          children: []
        },
        {
          id: 'role-3',
          name: 'Chief Financial Officer',
          description: 'CFO of the company',
          status: 'active',
          createdAt: '2023-01-15T08:00:00Z',
          updatedAt: '2023-02-18T10:30:00Z',
          employeeName: 'Michael Brown',
          employeeId: 'EMP003',
          email: 'michael.brown@example.com',
          children: []
        }
      ]
    },
    {
      id: 'dept-2',
      name: 'Engineering',
      description: 'Engineering department',
      status: 'active',
      createdAt: '2023-01-15T08:00:00Z',
      updatedAt: '2023-06-01T16:20:00Z',
      tags: ['technical', 'development'],
      children: [
        {
          id: 'team-1',
          name: 'Frontend Development',
          description: 'Frontend development team',
          status: 'active',
          createdAt: '2023-01-15T08:00:00Z',
          updatedAt: '2023-05-25T13:40:00Z',
          teamSize: 8,
          techStack: ['React', 'TypeScript', 'Next.js'],
          children: [
            {
              id: 'role-4',
              name: 'Frontend Lead',
              description: 'Lead frontend developer',
              status: 'active',
              createdAt: '2023-01-15T08:00:00Z',
              updatedAt: '2023-04-12T11:10:00Z',
              employeeName: 'Emily Davis',
              employeeId: 'EMP004',
              email: 'emily.davis@example.com',
              children: []
            }
          ]
        },
        {
          id: 'team-2',
          name: 'Backend Development',
          description: 'Backend development team',
          status: 'active',
          createdAt: '2023-01-15T08:00:00Z',
          updatedAt: '2023-05-18T09:30:00Z',
          teamSize: 10,
          techStack: ['Node.js', 'Express', 'MongoDB'],
          children: [
            {
              id: 'role-5',
              name: 'Backend Lead',
              description: 'Lead backend developer',
              status: 'active',
              createdAt: '2023-01-15T08:00:00Z',
              updatedAt: '2023-03-28T15:50:00Z',
              employeeName: 'David Wilson',
              employeeId: 'EMP005',
              email: 'david.wilson@example.com',
              children: []
            }
          ]
        }
      ]
    },
    {
      id: 'dept-3',
      name: 'Marketing',
      description: 'Marketing department',
      status: 'active',
      createdAt: '2023-01-15T08:00:00Z',
      updatedAt: '2023-04-30T12:15:00Z',
      tags: ['marketing', 'branding'],
      children: [
        {
          id: 'team-3',
          name: 'Digital Marketing',
          description: 'Digital marketing team',
          status: 'active',
          createdAt: '2023-01-15T08:00:00Z',
          updatedAt: '2023-04-22T10:05:00Z',
          teamSize: 5,
          channels: ['Social Media', 'Email', 'SEO'],
          children: []
        },
        {
          id: 'team-4',
          name: 'Content Creation',
          description: 'Content creation team',
          status: 'inactive',
          createdAt: '2023-01-15T08:00:00Z',
          updatedAt: '2023-03-15T14:20:00Z',
          teamSize: 3,
          contentTypes: ['Blog Posts', 'Videos', 'Infographics'],
          children: []
        }
      ]
    }
  ]
};

/**
 * Default configuration for the hierarchy designer
 */
export const defaultHierarchyConfig: HierarchyConfig = {
  expandedFields: ['description', 'tags', 'createdAt', 'updatedAt', 'employeeName', 'email', 'teamSize'],
  treeOptions: {
    showMinimap: true,
    allowEditing: true,
    zoomable: true,
    centerOnLoad: true,
    direction: 'horizontal',
  },
  listOptions: {
    expandable: true,
    showActions: true,
    showStatus: true,
    animationDuration: 0.3,
    allowReordering: false,
    showChildrenCount: true,
  },
  searchFields: ['name', 'description', 'employeeName', 'email'],
  filterFields: ['status', 'tags'],
};

/**
 * Example usage of the HierarchyDesigner component with URL source
 */
export const HierarchyDesignerWithUrlExample: React.FC = () => {
  return (
    <div style={{ height: '600px', width: '100%' }}>
      <HierarchyDesigner
        source={{
          type: 'url',
          url: 'https://api.example.com/hierarchy-data',
          headers: {
            'Authorization': 'Bearer YOUR_API_TOKEN',
          },
        }}
        defaultView="tree"
        config={defaultHierarchyConfig}
        onNodeSelect={(node: HierarchyNode) => console.log('Selected node:', node)}
        onNodeEdit={(node: HierarchyNode, updates: Partial<HierarchyNode>) => console.log('Edit node:', node.id, updates)}
        onNodeDelete={(node: HierarchyNode) => console.log('Delete node:', node.id)}
        onExport={(format: 'pdf' | 'json', data: any) => console.log(`Exported as ${format}:`, data)}
      />
    </div>
  );
};

/**
 * Example usage of the HierarchyDesigner component with JSON source
 */
export const HierarchyDesignerWithJsonExample: React.FC = () => {
  return (
    <div style={{ height: '600px', width: '100%' }}>
      <HierarchyDesigner
        source={{
          type: 'json',
          data: sampleHierarchyData,
        }}
        defaultView="list"
        config={defaultHierarchyConfig}
        onNodeSelect={(node: HierarchyNode) => console.log('Selected node:', node)}
        onNodeEdit={(node: HierarchyNode, updates: Partial<HierarchyNode>) => console.log('Edit node:', node.id, updates)}
        onNodeDelete={(node: HierarchyNode) => console.log('Delete node:', node.id)}
        onExport={(format: 'pdf' | 'json', data: any) => console.log(`Exported as ${format}:`, data)}
      />
    </div>
  );
};

/**
 * Example usage with custom configuration
 */
export const HierarchyDesignerCustomConfigExample: React.FC = () => {
  const customConfig: HierarchyConfig = {
    expandedFields: ['description', 'employeeName', 'email', 'teamSize', 'techStack', 'channels', 'contentTypes'],
    treeOptions: {
      showMinimap: false,
      allowEditing: false,
      zoomable: true,
      centerOnLoad: true,
      direction: 'vertical',
    },
    listOptions: {
      expandable: true,
      showActions: true,
      showStatus: true,
      animationDuration: 0.5,
      allowReordering: true,
      showChildrenCount: true,
    },
    searchFields: ['name', 'description', 'employeeName', 'email'],
    filterFields: ['status'],
    defaultExpandedNodes: ['dept-1', 'dept-2'],
  };

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <HierarchyDesigner
        source={{
          type: 'json',
          data: sampleHierarchyData,
        }}
        defaultView="tree"
        config={customConfig}
      />
    </div>
  );
};