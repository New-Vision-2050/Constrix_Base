"use client";
import React from "react";
import { ReactFlow, NodeTypes } from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import ManagementCustomNode from "./ManagementCustomNode";
import { useManagementsStructureCxt } from "../context";

export default function ReactFlowDiagram() {
  const { nodes, onNodesChange, edges, onEdgesChange } =
    useManagementsStructureCxt();

  const nodeTypes: NodeTypes = {
    custom: ManagementCustomNode,
  };

  return (
    <div style={{ width: "100%", height: "700px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        defaultEdgeOptions={{ type: 'step' }}
      />
    </div>
  );
}
