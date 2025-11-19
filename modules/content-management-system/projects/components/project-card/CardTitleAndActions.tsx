"use client";
import dynamic from "next/dynamic";
import type { MenuItem } from "@/app/[locale]/(main)/companies/cells/execution";

// Dynamically import Execution component (same as TableBuilder)
const Execution = dynamic(
  () => import("@/app/[locale]/(main)/companies/cells/execution"),
  {
    ssr: false,
  }
);

/**
 * Card Title and Actions Component
 * Uses Execution component from TableBuilder for consistent actions UI
 * Follows Single Responsibility Principle
 */
type PropsT = {
  id: string;
  title: string;
  actions?: MenuItem[];
}
export default function CardTitleAndActions({ id, title, actions = [] }: PropsT) {
  // Mock row data - replace with actual project data
  const projectRow = {
    id: id,
    title: title,
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">{projectRow.title}</h1>
      <Execution
        row={projectRow}
        executions={actions}
        buttonLabel="Actions"
        className="px-5 bg-[#8785A2] hover:bg-[#8785A2] rotate-svg-child"
        showEdit={false}
        showDelete={false}
      />
    </div>
  );
}