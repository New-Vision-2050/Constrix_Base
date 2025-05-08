
import { OrgChartNode } from "@/types/organization";

export interface FlattenedNode {
  node: OrgChartNode;
  parentName: string; 
  depth: number;
  path: string;
  isVisible: boolean;
}

// Flatten the org tree into a list for table display
export const flattenOrgNodes = (node: OrgChartNode, parentName: string = "", depth: number = 0, path: string = ""): FlattenedNode[] => {
  const nodePath = path ? `${path}.${node.id}` : node.id;
  const result: FlattenedNode[] = [{ 
    node, 
    parentName, 
    depth, 
    path: nodePath,
    isVisible: depth <= 1 // Only first two levels visible by default
  }];
  
  if (node.children && node.children.length) {
    for (const child of node.children) {
      const flattenedChildren = flattenOrgNodes(child, node.name, depth + 1, nodePath);
      result.push(...flattenedChildren);
    }
  }
  
  return result;
};
