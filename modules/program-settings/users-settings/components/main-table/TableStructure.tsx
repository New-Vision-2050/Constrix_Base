"use client";
import { TableBuilder } from "@/modules/table";
import React from "react";
import { UsersConfigV2 } from "@/modules/table/utils/configs/usersTableConfigV2";

const TableStructure = () => {
  return <TableBuilder config={UsersConfigV2()} />;
};

export default TableStructure;
