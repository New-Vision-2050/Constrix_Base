import { useMemo, useState } from 'react'
import { OrgChartNode } from '@/types/organization'
import { FlattenedNode, flattenOrgNodes } from '../utils/flattenOrgNodes'

interface UseListViewResult {
  expandedNodes: Set<string>;
  expandedDetails: Set<string>;
  visibleNodes: FlattenedNode[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  toggleNodeExpansion: (nodeId: string) => void;
  toggleDetailsExpansion: (node: OrgChartNode) => void;
}

export function useListView(data: OrgChartNode): UseListViewResult {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([data.id?.toString()]));
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const flattenedNodes = useMemo(() => flattenOrgNodes(data), [data]);

  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId?.toString())) {
        newSet.delete(nodeId?.toString());
      } else {
        newSet.add(nodeId?.toString());
      }
      return newSet;
    });
  };

  const toggleDetailsExpansion = (node: OrgChartNode) => {
    setExpandedDetails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(node.id?.toString())) {
        newSet.delete(node.id?.toString());
      } else {
        newSet.add(node.id?.toString());
      }
      return newSet;
    });
  };

  // Filter nodes based on search term and expanded state
  const visibleNodes = useMemo(() => {
    // First filter by search term if provided
    const searchFiltered = searchTerm ? flattenedNodes.filter(({ node }) => {
      return node.name.toLowerCase().includes(searchTerm.toLowerCase());
    }) : flattenedNodes;

    // Then filter by expanded state
    return searchFiltered.filter(node => {
      if (node.depth === 0) return true; // Root is always visible
      
      if (searchTerm) return true; // If searching, show all matches regardless of expansion
      
      // Check if all parent nodes in the path are expanded
      const pathParts = node.path.split('.');
      // Remove the current node from the path
      pathParts.pop();

      // For each parent in the path, check if it's expanded
      return pathParts.every(parentId => expandedNodes.has(parentId));
    });
  }, [flattenedNodes, expandedNodes, searchTerm]);

  return {
    expandedNodes,
    expandedDetails,
    visibleNodes,
    searchTerm,
    setSearchTerm,
    toggleNodeExpansion,
    toggleDetailsExpansion
  };
}
