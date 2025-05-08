import { DiagramEdge } from "../types/DiagramEdge";
import { CustomBranchNodeT } from "../types/CustomBranchNode";

type InputNode = CustomBranchNodeT & {
  id: number;
  children?: InputNode[];
};

export const generateDiagramEdges = (
  data: InputNode[],
  edges: DiagramEdge[] = []
): DiagramEdge[] => {
    
  data.forEach((item) => {
    if (item.children && item.children.length > 0) {
      item.children.forEach((child) => {
        edges.push({
          id: `${item.id}-${child.id}`,
          source: item.id.toString(),
          target: child.id.toString(),
        });

        // recursive call for grandchildren
        generateDiagramEdges([child], edges);
      });
    }
  });

  return edges;
};
