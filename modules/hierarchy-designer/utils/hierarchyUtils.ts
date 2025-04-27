import { HierarchyNode } from '../types/hierarchyTypes';

/**
 * Find a node by its ID in the hierarchy tree
 * 
 * @param root The root node to start searching from
 * @param nodeId The ID of the node to find
 * @returns The found node or null if not found
 */
export const findNodeById = (
  root: HierarchyNode,
  nodeId: string
): HierarchyNode | null => {
  if (root.id === nodeId) {
    return root;
  }

  if (!root.children || root.children.length === 0) {
    return null;
  }

  for (const child of root.children) {
    const found = findNodeById(child, nodeId);
    if (found) {
      return found;
    }
  }

  return null;
};

/**
 * Find a node's parent by the node's ID
 * 
 * @param root The root node to start searching from
 * @param nodeId The ID of the node whose parent to find
 * @returns An object containing the parent node and the index of the child, or null if not found
 */
export const findParentByChildId = (
  root: HierarchyNode,
  nodeId: string
): { parent: HierarchyNode; childIndex: number } | null => {
  if (!root.children || root.children.length === 0) {
    return null;
  }

  for (let i = 0; i < root.children.length; i++) {
    if (root.children[i].id === nodeId) {
      return { parent: root, childIndex: i };
    }

    const found = findParentByChildId(root.children[i], nodeId);
    if (found) {
      return found;
    }
  }

  return null;
};

/**
 * Update a node by its ID with new data
 * 
 * @param root The root node to start searching from
 * @param nodeId The ID of the node to update
 * @param updates The partial data to update the node with
 * @returns Boolean indicating success or failure
 */
export const updateNodeById = (
  root: HierarchyNode,
  nodeId: string,
  updates: Partial<HierarchyNode>
): boolean => {
  const node = findNodeById(root, nodeId);
  
  if (!node) {
    return false;
  }

  // Apply updates to the node
  Object.assign(node, updates);
  return true;
};

/**
 * Delete a node by its ID
 * 
 * @param root The root node to start searching from
 * @param nodeId The ID of the node to delete
 * @returns Boolean indicating success or failure
 */
export const deleteNodeById = (
  root: HierarchyNode,
  nodeId: string
): boolean => {
  // Can't delete the root node
  if (root.id === nodeId) {
    return false;
  }

  const result = findParentByChildId(root, nodeId);
  
  if (!result) {
    return false;
  }

  const { parent, childIndex } = result;
  parent.children?.splice(childIndex, 1);
  return true;
};

/**
 * Add a new node to a parent node
 * 
 * @param root The root node to start searching from
 * @param parentId The ID of the parent node
 * @param newNode The new node to add
 * @returns Boolean indicating success or failure
 */
export const addNodeToParent = (
  root: HierarchyNode,
  parentId: string,
  newNode: HierarchyNode
): boolean => {
  const parent = findNodeById(root, parentId);
  
  if (!parent) {
    return false;
  }

  if (!parent.children) {
    parent.children = [];
  }

  parent.children.push(newNode);
  return true;
};

/**
 * Flatten a hierarchy tree into an array of nodes
 * 
 * @param root The root node to start from
 * @returns Array of all nodes in the tree
 */
export const flattenHierarchy = (
  root: HierarchyNode
): HierarchyNode[] => {
  const result: HierarchyNode[] = [root];
  
  if (root.children && root.children.length > 0) {
    for (const child of root.children) {
      result.push(...flattenHierarchy(child));
    }
  }
  
  return result;
};

/**
 * Filter nodes based on search term and filters
 * 
 * @param nodes Array of nodes to filter
 * @param searchTerm Search term to filter by
 * @param filters Object of filters to apply
 * @param searchFields Fields to search in
 * @returns Filtered array of nodes
 */
export const filterNodes = (
  nodes: HierarchyNode[],
  searchTerm: string,
  filters: Record<string, any>,
  searchFields: string[] = ['name', 'description']
): HierarchyNode[] => {
  return nodes.filter(node => {
    // Apply search term filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm = searchFields.some(field => {
        const value = node[field];
        return value && String(value).toLowerCase().includes(searchTermLower);
      });
      
      if (!matchesSearchTerm) {
        return false;
      }
    }
    
    // Apply field filters
    for (const [field, value] of Object.entries(filters)) {
      if (value === undefined || value === null) {
        continue;
      }
      
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
  });
};

/**
 * Get all unique values for a specific field across all nodes
 * 
 * @param nodes Array of nodes
 * @param field Field to get values for
 * @returns Array of unique values
 */
export const getUniqueFieldValues = (
  nodes: HierarchyNode[],
  field: string
): any[] => {
  const values = new Set<any>();
  
  nodes.forEach(node => {
    const value = node[field];
    
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => values.add(v));
      } else {
        values.add(value);
      }
    }
  });
  
  return Array.from(values);
};