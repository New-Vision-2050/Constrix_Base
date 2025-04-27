import { create } from 'zustand';
import { 
  HierarchyNode, 
  HierarchyState, 
  HierarchyActions, 
  HierarchyStore,
  HierarchyViewMode,
  HierarchyConfig
} from '../types/hierarchyTypes';
import { findNodeById, deleteNodeById, updateNodeById, addNodeToParent } from '../utils/hierarchyUtils';
import { exportToPdf } from '../utils/exportUtils';

const initialState: HierarchyState = {
  data: null,
  isLoading: false,
  error: null,
  selectedNodeId: null,
  expandedNodeIds: [],
  searchTerm: '',
  filters: {},
  currentView: 'tree',
  config: {
    expandedFields: ['description', 'tags', 'createdAt'],
    treeOptions: {
      showMinimap: true,
      allowEditing: false,
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
  },
};

const useHierarchyStore = create<HierarchyStore>((set, get) => ({
  ...initialState,

  // Data actions
  setData: (data) => set({ data }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),

  // Node selection and expansion
  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),
  
  toggleNodeExpansion: (nodeId) => set((state) => {
    const isExpanded = state.expandedNodeIds.includes(nodeId);
    return {
      expandedNodeIds: isExpanded
        ? state.expandedNodeIds.filter(id => id !== nodeId)
        : [...state.expandedNodeIds, nodeId]
    };
  }),

  // Search and filtering
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  setFilter: (field, value) => set((state) => ({
    filters: { ...state.filters, [field]: value }
  })),
  
  clearFilters: () => set({ filters: {} }),

  // View management
  setView: (view) => set({ currentView: view }),
  
  updateConfig: (config) => set((state) => ({
    config: { ...state.config, ...config }
  })),

  // Node operations
  updateNode: (nodeId, updates) => set((state) => {
    if (!state.data) return state;
    
    const newData = { ...state.data };
    const success = updateNodeById(newData, nodeId, updates);
    
    return success ? { data: newData } : state;
  }),
  
  deleteNode: (nodeId) => set((state) => {
    if (!state.data) return state;
    
    const newData = { ...state.data };
    const success = deleteNodeById(newData, nodeId);
    
    return success ? { data: newData } : state;
  }),
  
  addNode: (parentId, node) => set((state) => {
    if (!state.data) return state;
    
    const newData = { ...state.data };
    
    // If parentId is null, add to root level (if data is an array)
    if (parentId === null) {
      if (Array.isArray(newData.children)) {
        newData.children.push(node);
        return { data: newData };
      }
      return state;
    }
    
    const success = addNodeToParent(newData, parentId, node);
    return success ? { data: newData } : state;
  }),

  // Export functionality
  exportData: (format) => {
    const { data, currentView, config } = get();
    
    if (!data) return null;
    
    if (format === 'pdf') {
      return exportToPdf(data, currentView, config);
    }
    
    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }
    
    return null;
  }
}));

export default useHierarchyStore;