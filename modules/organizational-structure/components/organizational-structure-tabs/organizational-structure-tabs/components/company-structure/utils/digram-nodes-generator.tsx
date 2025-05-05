import { CustomBranchNodeT } from "../types/CustomBranchNode";
import { DiagramNode } from "../types/DiagramNode";

type InputNode = CustomBranchNodeT & {
  id: number;
  children?: InputNode[];
};

export const generateDiagramNodes = (
  data: InputNode[],
  nodes: DiagramNode[] = [],
  level: number = 0,
  parentX: number = 0
): DiagramNode[] => {
  // declare and define helper variables
  const spacingX = 300;
  const spacingY = 200;

  data.forEach((item, i) => {
    const x = parentX + i * spacingX;
    const y = level * spacingY;

    // current node
    const node: DiagramNode = {
      id: item.id.toString(),
      type: "custom",
      position: { x, y },
      data: {
        parent_id: item.parent_id,
        name: item.name,
        type: item.type,
        manager: item.manager,
        deputy_manager: item.deputy_manager,
        department_count: item.department_count,
        management_count: item.management_count,
        branch_count: item.branch_count,
        user_count: item.user_count,
      },
    };

    nodes.push(node);

    // check if there is children call fire fun again
    if (item.children && item.children.length > 0) {
      generateDiagramNodes(item.children, nodes, level + 1, x);
    }
  });

  return nodes;
};
