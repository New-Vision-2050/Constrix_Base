
import { OrgChartNode } from "@/types/organization";

// Function to find a node by ID in the tree
export const findNodeById = (node: OrgChartNode, id: string): OrgChartNode | null => {
  if (node.id === id) {
    return node;
  }
  
  for (const child of node.children) {
    const found = findNodeById(child, id);
    if (found) {
      return found;
    }
  }
  
  return null;
};
