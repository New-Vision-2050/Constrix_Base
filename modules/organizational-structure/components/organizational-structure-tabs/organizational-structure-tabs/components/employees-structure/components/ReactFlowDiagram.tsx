"use client";
import React from "react";
import { ReactFlow, NodeTypes } from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { useUsersStructureCxt } from "../context";
import CustomUserNode from "./CustomUserNode";

export default function ReactFlowDiagram() {
  const { nodes, onNodesChange, edges, onEdgesChange } = useUsersStructureCxt();

  const nodeTypes: NodeTypes = {
    custom: CustomUserNode,
  };

  return (
    <div style={{ width: "100%", height: "700px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
    </div>
  );
}
