import { Pagination } from "@/components/shared/Pagination";
import GridItem from "../../../publicDocs/views/public-docs-tab/GridItem";
import { useEmpsDocsCxt } from "../../contexts/emps-docs-cxt";

// Loading skeleton component for grid items
const GridItemSkeleton = () => (
  <div className="w-48 h-32 bg-muted/50 border border-border rounded-lg animate-pulse transition-colors">
    <div className="p-4 space-y-3">
      <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
      <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
      <div className="h-3 bg-muted rounded w-2/3 animate-pulse"></div>
    </div>
  </div>
);

export default function GridViewMode() {
  const { docs, docsPagination, isLoadingDocs, setLimit, setPage } =
    useEmpsDocsCxt();

  return (
    <div className="relative min-h-96 bg-sidebar rounded-lg p-4 flex flex-col justify-between">
      {/* items */}
      <div className="flex flex-row items-center gap-6 flex-wrap flex-grow">
        {isLoadingDocs ? (
          // Show loading skeletons
          Array.from({ length: 12 }).map((_, index) => (
            <GridItemSkeleton key={`skeleton-${index}`} />
          ))
        ) : (
          // Show actual grid items when loaded
          <>
            {docs?.folders?.map((folder) => (
              <GridItem isDir={true} document={folder} key={folder.id} />
            ))}
            {docs?.files?.map((file) => (
              <GridItem isDir={false} document={file} key={file.id} />
            ))}
          </>
        )}
      </div>

      {/* Pagination component - disabled during loading */}
      <div className="mt-8 flex justify-center w-full">
        <div className={isLoadingDocs ? "opacity-50 pointer-events-none" : ""}>
          <Pagination
            currentPage={docsPagination?.current_page ?? 1}
            totalPages={docsPagination?.last_page ?? 1}
            onPageChange={(page) => setPage(page)}
            currentLimit={docsPagination?.per_page ?? 10}
            limitOptions={[10, 25, 50, 100]}
            onLimitChange={(limit) => setLimit(limit)}
          />
        </div>
      </div>
    </div>
  );
}
