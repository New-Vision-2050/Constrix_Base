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
import useUsersHierarchiesData from "../hooks/useUsershHierarchiesData";
import { generateUsersDiagramNodes } from "../utils/generate-users-nodes";
import { generateUsersDiagramEdges } from "../utils/generate-users-edges";

// declare context types
type CxtType = {
  // nodes
  nodes: DiagramNode[];
  onNodesChange: OnNodesChange<DiagramNode>;
  // edges
  edges: DiagramEdge[];
  onEdgesChange: OnEdgesChange<DiagramEdge>;
};

export const UsersStructureCxt = createContext<CxtType>({} as CxtType);

// ** create a custom hook to use the context
export const useUsersStructureCxt = () => {
  const context = useContext(UsersStructureCxt);
  if (!context) {
    throw new Error(
      "useUsersStructureCxt must be used within a UsersStructureCxtProvider"
    );
  }
  return context;
};

const initialNodes: DiagramNode[] = [];
const initialEdges: DiagramEdge[] = [];
export const UsersStructureCxtProvider = (props: React.PropsWithChildren) => {
  // ** declare and define component state and variables
  const { children } = props;
  const { data } = useUsersHierarchiesData();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // ** handle side effects
  useEffect(() => {
    if (data && Array.isArray(data)) {
      const _nodes = generateUsersDiagramNodes(data);
      const _edges = generateUsersDiagramEdges(data);

      handleChangeDiagramNodes(_nodes);
      handleChangeDiagramEdges(_edges);
      console.log("Data of _nodes::", _nodes, _edges);
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
    <UsersStructureCxt.Provider
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
    </UsersStructureCxt.Provider>
  );
};
