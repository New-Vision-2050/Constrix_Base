"use client";
import { TableBuilder } from "@/modules/table";
import React from "react";
import { StructureTableConfig } from "../../config/StructureTableConfig";

const TableStructure = () => {
  return <TableBuilder config={StructureTableConfig()} />;
};

export default TableStructure;
