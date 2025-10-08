import { Pagination } from "@/components/shared/Pagination";
import { usePublicDocsCxt } from "../../contexts/public-docs-cxt";
import DirectoryPasswordDialog from "./components/DirectoryPasswordDialog";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { TableHeader } from "./components/TableHeader";
import { TableRow } from "./components/TableRow";

/**
 * Main public documents table component
 * Displays documents in a structured table format
 */
export const PublicDocsTable = () => {
  const {
    docs,
    isLoadingDocs,
    setOpenDirWithPassword,
    openDirWithPassword,
    docsPagination,
    setPage,
    setLimit,
  } = usePublicDocsCxt();

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
            {allDocuments.map((document) => (
              <TableRow
                key={document.id}
                document={document}
                isFolder={!document.reference_number}
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
      <DirectoryPasswordDialog
        open={openDirWithPassword}
        onClose={() => {
          setOpenDirWithPassword(false);
        }}
      />
    </div>
  );
};
