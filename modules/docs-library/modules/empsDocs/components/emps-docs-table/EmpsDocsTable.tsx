import { Pagination } from "@/components/shared/Pagination";
import { useEmpsDocsCxt } from "../../contexts/emps-docs-cxt";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { TableHeader } from "./components/TableHeader";
import { TableRow } from "./components/TableRow";

/**
 * Employee documents table component
 * Displays documents in a structured table format
 */
export const EmpsDocsTable = () => {
  const { docs, isLoadingDocs, docsPagination, setPage, setLimit } =
    useEmpsDocsCxt();

  if (isLoadingDocs) {
    return <LoadingSpinner />;
  }

  const allDocuments = [...(docs?.folders || []), ...(docs?.files || [])];

  return (
    <div className="bg-sidebar rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader />
          <tbody className="divide-y divide-border">
            {(docs?.folders || []).map((document) => (
              <TableRow key={document.id} document={document} isFolder={true} />
            ))}
            {(docs?.files || []).map((document) => (
              <TableRow
                key={document.id}
                document={document}
                isFolder={false}
              />
            ))}
          </tbody>
        </table>
      </div>

      {allDocuments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No documents found
        </div>
      )}

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
};
