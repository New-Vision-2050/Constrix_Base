"use client";
import dynamic from "next/dynamic";
import { EditIcon } from "lucide-react";
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
export default function CardTitleAndActions() {
  // Mock row data - replace with actual project data
  const projectRow = {
    id: "1",
    title: "Project Title",
  };

  // Define action items for the Execution component
  const executions: MenuItem[] = [
    {
      label: "Edit",
      icon: <EditIcon className="w-4 h-4" />,
      action: () => {
        // Handle edit action
        console.log("Edit clicked");
      },
    },
  ];

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">{projectRow.title}</h1>
      <Execution
        row={projectRow}
        executions={executions}
        buttonLabel="Actions"
        className="px-5 bg-[#8785A2] hover:bg-[#8785A2] rotate-svg-child"
        showEdit={false}
        showDelete={false}
      />
    </div>
  );
}