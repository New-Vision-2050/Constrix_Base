# Dynamic Hierarchy Designer Tool

A powerful tool for visualizing and managing hierarchical data structures with both tree and list views, based on JSON data.

## Features

### Source Data
- JSON data can be fetched from URL or pasted manually
- Automatic parsing and validation of hierarchical structures

### Tree Mode
- Interactive tree showing parent/child relations
- Zoom In/Out support
- Focus/unfocus on specific nodes
- Export entire tree view as PDF

### List Mode
- Display nodes in a list format
- Each row shows basic node info (title, status, etc.)
- Expandable rows with smooth animation
- Detailed view inside expanded rows
- Action buttons on each row: Edit, Delete, Focus in Tree

### Configuration
- Auto-generate config from JSON dynamically
- Configurable fields shown inside expanded view
- Support for custom field rendering

### Search & Filter
- Search nodes by title, description, or any field
- Filter nodes by status, type, or custom criteria
- Highlight matching nodes in both views

### Export Options
- Export as PDF (both views)
- Export as JSON
- Save/load hierarchy templates

## Usage

```tsx
import { HierarchyDesigner } from 'modules/hierarchy-designer';

// Example usage with URL source
const MyHierarchyComponent = () => {
  return (
    <HierarchyDesigner 
      source={{ 
        type: 'url', 
        url: 'https://api.example.com/hierarchy-data' 
      }}
      defaultView="tree"
      config={{
        expandedFields: ['description', 'createdAt', 'tags'],
        treeOptions: {
          showMinimap: true,
          allowEditing: true
        }
      }}
    />
  );
};

// Example usage with manual JSON input
const MyManualHierarchyComponent = () => {
  const jsonData = {
    id: "root",
    name: "Root Node",
    children: [
      {
        id: "child1",
        name: "Child 1",
        status: "active",
        description: "This is child 1",
        children: []
      },
      {
        id: "child2",
        name: "Child 2",
        status: "inactive",
        description: "This is child 2",
        children: [
          {
            id: "grandchild1",
            name: "Grandchild 1",
            status: "active",
            description: "This is grandchild 1",
            children: []
          }
        ]
      }
    ]
  };

  return (
    <HierarchyDesigner 
      source={{ 
        type: 'json', 
        data: jsonData 
      }}
      defaultView="list"
    />
  );
};
```

## Tech Stack

- React (Next.js)
- react-flow for tree visualization
- Zustand for state management
- TailwindCSS for styling
- framer-motion for animations
- html2canvas + jsPDF for PDF export