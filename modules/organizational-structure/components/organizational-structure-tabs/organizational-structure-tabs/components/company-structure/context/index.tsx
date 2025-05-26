"use client";

import {
  OnEdgesChange,
  OnNodesChange,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
// import packages
import { createContext, useCallback, useContext, useEffect } from "react";
import { DiagramNode } from "../types/DiagramNode";
import { DiagramEdge } from "../types/DiagramEdge";
import useBranchHierarchiesData from "../hooks/useBranchHierarchiesData";
import { generateDiagramNodes } from "../utils/digram-nodes-generator";
import { generateDiagramEdges } from "../utils/diagram-edges-generator";

// declare context types
type CxtType = {
  // nodes
  nodes: DiagramNode[];
  onNodesChange: OnNodesChange<DiagramNode>;
  // edges
  edges: DiagramEdge[];
  onEdgesChange: OnEdgesChange<DiagramEdge>;
};

export const CompanyStructureCxt = createContext<CxtType>({} as CxtType);

// ** create a custom hook to use the context
export const useCompanyStructureCxt = () => {
  const context = useContext(CompanyStructureCxt);
  if (!context) {
    throw new Error(
      "useCompanyStructureCxt must be used within a CompanyStructureCxtProvider"
    );
  }
  return context;
};

const initialNodes: DiagramNode[] = [];
const initialEdges: DiagramEdge[] = [];
export const CompanyStructureCxtProvider = (props: React.PropsWithChildren) => {
  // ** declare and define component state and variables
  const { children } = props;
  const { data } = useBranchHierarchiesData();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
    <CompanyStructureCxt.Provider
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
    </CompanyStructureCxt.Provider>
  );
};
