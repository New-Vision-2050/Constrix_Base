"use client";

import {
  OnEdgesChange,
  OnNodesChange,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
// import packages
import { createContext, useCallback, useContext, useEffect } from "react";
import { DiagramNode } from "../../company-structure/types/DiagramNode";
import { DiagramEdge } from "../../company-structure/types/DiagramEdge";
import useBranchHierarchiesData from "../../company-structure/hooks/useBranchHierarchiesData";
import { generateDiagramNodes } from "../../company-structure/utils/digram-nodes-generator";
import { generateDiagramEdges } from "../../company-structure/utils/diagram-edges-generator";

// declare context types
type CxtType = {
  // nodes
  nodes: DiagramNode[];
  onNodesChange: OnNodesChange<DiagramNode>;
  // edges
  edges: DiagramEdge[];
  onEdgesChange: OnEdgesChange<DiagramEdge>;
};

export const ManagementsStructureCxt = createContext<CxtType>({} as CxtType);

// ** create a custom hook to use the context
export const useManagementsStructureCxt = () => {
  const context = useContext(ManagementsStructureCxt);
  if (!context) {
    throw new Error(
      "useManagementsStructureCxt must be used within a ManagementsStructureCxtProvider"
    );
  }
  return context;
};

const initialNodes: DiagramNode[] = [];
const initialEdges: DiagramEdge[] = [];
export const ManagementsStructureCxtProvider = (
  props: React.PropsWithChildren
) => {
  // ** declare and define component state and variables
  const { children } = props;
  const { data } = useBranchHierarchiesData("management");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  console.log("management_management_data", data);

  // ** handle side effects
  useEffect(() => {
    if (data && Array.isArray(data)) {
      const _nodes = generateDiagramNodes(data);
      const _edges = generateDiagramEdges(data);

      handleChangeDiagramNodes(_nodes);
      handleChangeDiagramEdges(_edges);
      console.log("Data of _nodes::", _nodes);
    }
  }, [data]);

  // ** declare and define component helper methods
  const handleChangeDiagramNodes = useCallback((nodes: DiagramNode[]) => {
    setNodes(nodes);
  }, []);
  const handleChangeDiagramEdges = useCallback((edges: DiagramEdge[]) => {
    setEdges(edges);
  }, []);

  // ** return component ui
  return (
    <ManagementsStructureCxt.Provider
      value={{
        // diagram nodes
        nodes,
        onNodesChange,
        // diagram edges
        edges,
        onEdgesChange,
      }}
    >
      {children}
    </ManagementsStructureCxt.Provider>
  );
};
