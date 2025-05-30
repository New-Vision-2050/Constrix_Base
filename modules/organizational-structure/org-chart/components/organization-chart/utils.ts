
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

// export const orgTreeReOrganizationPayload = (
//   payload: OrgChartNode,
//   concatKey: string,
//   concatValue: string | number | undefined
// ): OrgChartNode => {
//   const transform = (node: OrgChartNode): OrgChartNode => {
//     if (!node.children || !Array.isArray(node.children)) return node;
//
//     const matchedNodes: unknown[] = [];
//     const otherNodes: unknown[] = [];
//
//     for (const child of node.children) {
//       if (child[concatKey] === concatValue) {
//         matchedNodes.push(transform(child));
//       } else {
//         otherNodes.push(transform(child));
//       }
//     }
//
//     const newChildren = [...otherNodes];
//
//     if (matchedNodes.length > 0) {
//       newChildren.push({
//         id: `${concatValue}-${node?.id}-${new Date().toISOString()}`,
//         [concatKey]: concatValue,
//         parent_id: node?.id,
//         list: matchedNodes,
//       });
//     }
//
//     return {
//       ...node,
//       children: newChildren,
//     } as OrgChartNode;
//   };
//
//   return transform(payload);
// };

export const orgTreeReOrganizationPayload = (
  payload: OrgChartNode,
  concatKey: string,
  concatValue: string | number | undefined
): OrgChartNode => {
  const transform = (node: OrgChartNode): OrgChartNode => {
    if (!Array.isArray(node.children)) return node;

    const matchedNodes: OrgChartNode[] = [];
    const transformedChildren: OrgChartNode[] = [];
    let insertIndex: number | null = null;

    node.children.forEach((child, index) => {
      const transformedChild = transform(child);
      if (child[concatKey] === concatValue) {
        if (insertIndex === null) insertIndex = index;
        matchedNodes.push(transformedChild);
      } else {
        transformedChildren.push(transformedChild);
      }
    });

    // If there are matched nodes, insert the group node at the original index
    if (matchedNodes.length > 0 && insertIndex !== null) {
      const groupedNode: Partial<OrgChartNode> = {
        id: `${concatValue}-${node.id}-${new Date().toISOString()}`,
        [concatKey]: concatValue,
        parent_id: node.id,
        list: matchedNodes,
        children: [],
      };
      transformedChildren.splice(insertIndex, 0, <OrgChartNode>groupedNode);
    }

    return {
      ...node,
      children: transformedChildren,
    };
  };

  return transform(payload);
};