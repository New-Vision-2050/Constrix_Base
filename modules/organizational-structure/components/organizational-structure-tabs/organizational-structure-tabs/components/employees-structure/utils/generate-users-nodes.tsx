import { DiagramNode } from "../../company-structure/types/DiagramNode";
import { UsersHierarchiesResponse } from "../api/users-tree-data";

export function generateUsersDiagramNodes(
  items: UsersHierarchiesResponse[],
  depth = 0,
  nodes: DiagramNode[] = [],
  xOffset = 0
): DiagramNode[] {
  let x = xOffset;

  for (const item of items) {
    for (const user of item.users) {
      nodes.push({
        id: user.id ?? "",
        type: "custom",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        position: { x, y: depth * 150 },
      });
      x += 250;
    }

    if (item.children?.length) {
      generateUsersDiagramNodes(item.children, depth + 1, nodes, x);
    }
  }

  return nodes;
}
