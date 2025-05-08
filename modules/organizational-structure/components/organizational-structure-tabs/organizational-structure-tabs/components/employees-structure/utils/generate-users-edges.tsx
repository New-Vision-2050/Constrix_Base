import { DiagramEdge } from "../../company-structure/types/DiagramEdge";
import { UsersHierarchiesResponse } from "../api/users-tree-data";
import { UserHierarchies } from "../types/UserHierarchies";

export function generateUsersDiagramEdges(
  items: UsersHierarchiesResponse[],
  parentIds: string[] = [],
  edges: DiagramEdge[] = []
): DiagramEdge[] {
  for (const item of items) {
    const currentUserIds =
      item.users?.map((u: UserHierarchies) => u.id ?? "") ?? [];

    for (const parentId of parentIds) {
      for (const childId of currentUserIds) {
        edges.push({
          id: `${parentId}-${childId}`,
          source: parentId,
          target: childId ?? "",
        });
      }
    }

    const newParentIds = currentUserIds.length > 0 ? currentUserIds : parentIds;

    if (item.children?.length) {
      generateUsersDiagramEdges(item.children, newParentIds, edges);
    }
  }

  return edges;
}
