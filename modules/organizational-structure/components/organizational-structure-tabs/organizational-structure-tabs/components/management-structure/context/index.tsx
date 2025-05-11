"use client";

import {
  OnEdgesChange,
  OnNodesChange,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
// import packages
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { DiagramNode } from "../../company-structure/types/DiagramNode";
import { DiagramEdge } from "../../company-structure/types/DiagramEdge";
import useBranchHierarchiesData from "../../company-structure/hooks/useBranchHierarchiesData";
import { generateDiagramNodes } from "../../company-structure/utils/digram-nodes-generator";
import { generateDiagramEdges } from "../../company-structure/utils/diagram-edges-generator";
import { useOrgStructureCxt } from "@/modules/organizational-structure/context/OrgStructureCxt";


// declare context types
type CxtType = {
  // nodes
  nodes: DiagramNode[];
  onNodesChange: OnNodesChange<DiagramNode>;
  // edges
  edges: DiagramEdge[];
  onEdgesChange: OnEdgesChange<DiagramEdge>;

  // active branch
  activeBranch: string | undefined;
  handleChangeActiveBranch: (id: string) => void;

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
  const { branchiesList } = useOrgStructureCxt();
  const { data } = useBranchHierarchiesData("management");
  const [activeBranch, setActiveBranch] = useState<string>(
    branchiesList?.[0]?.id ?? ""
  );
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

  const handleChangeActiveBranch = useCallback(
    (id: string) => setActiveBranch(id),
    []
  );

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
        // active branch
        activeBranch,
        handleChangeActiveBranch,
      }}
    >
      {children}
    </ManagementsStructureCxt.Provider>
  );
};
