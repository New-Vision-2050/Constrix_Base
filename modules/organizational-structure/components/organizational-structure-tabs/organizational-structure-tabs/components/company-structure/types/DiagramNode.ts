import { CustomBranchNodeT } from "./CustomBranchNode";

type Position = {
  x: number;
  y: number;
};

export type DiagramNode = {
  id: string;
  type: string;
  position: Position;
  data: CustomBranchNodeT;
};
