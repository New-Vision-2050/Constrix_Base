import { useBranches } from "@/modules/attendance-departure/hooks/useBranches";
import { useTranslations } from "next-intl";
import { useProjectAttachmentsCxt } from "./context/project-attachments-cxt";

export default function ProjectBranchesList() {
  const t = useTranslations("docs-library.publicDocs");
  const { branchId, handleSetBranchId } = useProjectAttachmentsCxt();
  const { branches } = useBranches();

  return (
    <div className="mb-4 bg-sidebar rounded-lg p-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        <button
          type="button"
          onClick={() => handleSetBranchId("all")}
          className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors ${
            branchId === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80 text-muted-foreground"
          }`}
        >
          {t("allBranches")}
        </button>
        {branches?.map((branch) => (
          <button
            type="button"
            key={branch.id}
            onClick={() => handleSetBranchId(branch.id)}
            className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors ${
              branchId === branch.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            {branch.name}
          </button>
        ))}
      </div>
    </div>
  );
}
