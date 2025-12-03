"use client";
import dynamic from "next/dynamic";
import type { MenuItem } from "@/app/[locale]/(main)/companies/cells/execution";
import { truncateString } from "@/utils/truncate-string";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("content-management-system.projects.addProjectForm");
  const projectRow = {
    id: id,
    title: title,
  };

  return (
    <div className="flex items-center justify-between w-full overflow-hidden gap-2">
      <h1 className="text-2xl font-bold min-w-0 flex-1 truncate" title={projectRow.title}>
        {truncateString(projectRow.title, 12)}
      </h1>
      <div className="flex-shrink-0">
        <Execution
          row={projectRow}
          executions={actions}
          buttonLabel={t("actions")}
          className="px-5 bg-[#8785A2] hover:bg-[#8785A2] rotate-svg-child"
          showEdit={false}
          showDelete={false}
        />
      </div>
    </div>
  );
}