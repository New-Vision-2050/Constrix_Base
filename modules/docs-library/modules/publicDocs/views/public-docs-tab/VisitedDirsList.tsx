import { usePublicDocsCxt } from "../../contexts/public-docs-cxt";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

export default function VisitedDirsList() {
  const lang = useLocale();
  const isRtl = lang === "ar";
  const { visitedDirs, setParentId, setVisitedDirs } = usePublicDocsCxt();

  // Handle navigation to a specific directory
  const handleNavigateToDir = (targetIndex: number) => {
    if (targetIndex === -1) {
      // Navigate to root (Home)
      setParentId(undefined);
      setVisitedDirs([]);
    } else {
      // Navigate to specific directory
      const targetDir = visitedDirs[targetIndex];
      setParentId(targetDir.id);

      // Remove all directories after the target index
      setVisitedDirs((prev) => prev.slice(0, targetIndex + 1));
    }
  };

  return (
    <div className="flex items-center gap-1 p-2 bg-sidebar rounded-lg overflow-x-auto">
      {/* Home button */}
      <Button
        variant="ghost"
        size="sm"
        disabled={visitedDirs.length === 0}
        onClick={() => handleNavigateToDir(-1)}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground shrink-0"
      >
        <Home className="h-4 w-4" />
        <span>{isRtl ? "مكتبة البيانات" : "Data Library"}</span>
      </Button>

      {/* Breadcrumb items */}
      {visitedDirs.map((dir, index) => (
        <div key={dir.id} className="flex items-center gap-1 shrink-0">
          {isRtl ? (
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <Button
            variant="ghost"
            size="sm"
            disabled={index === visitedDirs.length - 1}
            onClick={() => handleNavigateToDir(index)}
            className={cn(
              "text-sm hover:text-foreground",
              index === visitedDirs.length - 1
                ? "text-foreground font-medium" // Current directory
                : "text-muted-foreground" // Previous directories
            )}
          >
            {dir.name}
          </Button>
        </div>
      ))}
    </div>
  );
}
