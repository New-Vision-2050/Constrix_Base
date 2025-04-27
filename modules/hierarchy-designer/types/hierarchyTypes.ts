/**
 * Type definitions for the Hierarchy Designer module
 */

// Node data structure
export interface HierarchyNode {
  id: string;
  name: string;
  status?: string;
  description?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  type?: string;
  metadata?: Record<string, any>;
  children?: HierarchyNode[];
  [key: string]: any; // Allow for dynamic fields
}

// Source configuration
export type HierarchyDataSource = 
  | { type: 'url'; url: string; headers?: Record<string, string> }
  | { type: 'json'; data: HierarchyNode };

// View modes
export type HierarchyViewMode = 'tree' | 'list';

// Tree view options
export interface TreeViewOptions {
  showMinimap?: boolean;
  allowEditing?: boolean;
  allowDragDrop?: boolean;
  zoomable?: boolean;
  initialZoom?: number;
  nodePadding?: number;
  nodeWidth?: number;
  nodeHeight?: number;
  direction?: 'horizontal' | 'vertical';
  centerOnLoad?: boolean;
}

// List view options
export interface ListViewOptions {
  expandable?: boolean;
  showActions?: boolean;
  showStatus?: boolean;
  rowHeight?: number;
  expandedHeight?: number;
  animationDuration?: number;
  allowReordering?: boolean;
  showChildrenCount?: boolean;
}

// Configuration for the hierarchy designer
export interface HierarchyConfig {
  expandedFields?: string[];
  treeOptions?: TreeViewOptions;
  listOptions?: ListViewOptions;
  defaultExpandedNodes?: string[];
  searchFields?: string[];
  filterFields?: string[];
  customRenderers?: {
    [fieldName: string]: (value: any, node: HierarchyNode) => React.ReactNode;
  };
}

// Props for the main HierarchyDesigner component
export interface HierarchyDesignerProps {
  source: HierarchyDataSource;
  defaultView?: HierarchyViewMode;
  config?: HierarchyConfig;
  onNodeSelect?: (node: HierarchyNode) => void;
  onNodeEdit?: (node: HierarchyNode, updatedData: Partial<HierarchyNode>) => void;
  onNodeDelete?: (node: HierarchyNode) => void;
  onExport?: (format: 'pdf' | 'json', data: any) => void;
  className?: string;
  style?: React.CSSProperties;
}

// Props for the TreeView component
export interface TreeViewProps {
  data: HierarchyNode;
  options?: TreeViewOptions;
  onNodeSelect?: (node: HierarchyNode) => void;
  onNodeEdit?: (node: HierarchyNode, updatedData: Partial<HierarchyNode>) => void;
  onNodeDelete?: (node: HierarchyNode) => void;
  selectedNodeId?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Props for the ListView component
export interface ListViewProps {
  data: HierarchyNode;
  options?: ListViewOptions;
  expandedFields?: string[];
  onNodeSelect?: (node: HierarchyNode) => void;
  onNodeEdit?: (node: HierarchyNode, updatedData: Partial<HierarchyNode>) => void;
  onNodeDelete?: (node: HierarchyNode) => void;
  onFocusInTree?: (node: HierarchyNode) => void;
  selectedNodeId?: string;
  className?: string;
  style?: React.CSSProperties;
}

// State for the hierarchy store
export interface HierarchyState {
  data: HierarchyNode | null;
  isLoading: boolean;
  error: string | null;
  selectedNodeId: string | null;
  expandedNodeIds: string[];
  searchTerm: string;
  filters: Record<string, any>;
  currentView: HierarchyViewMode;
  config: HierarchyConfig;
}

// Actions for the hierarchy store
export interface HierarchyActions {
  setData: (data: HierarchyNode) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  selectNode: (nodeId: string | null) => void;
  toggleNodeExpansion: (nodeId: string) => void;
  setSearchTerm: (term: string) => void;
  setFilter: (field: string, value: any) => void;
  clearFilters: () => void;
  setView: (view: HierarchyViewMode) => void;
  updateConfig: (config: Partial<HierarchyConfig>) => void;
  updateNode: (nodeId: string, updates: Partial<HierarchyNode>) => void;
  deleteNode: (nodeId: string) => void;
  addNode: (parentId: string | null, node: HierarchyNode) => void;
  exportData: (format: 'pdf' | 'json') => any;
}

// Combined store type
export interface HierarchyStore extends HierarchyState, HierarchyActions {}