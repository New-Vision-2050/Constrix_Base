import { usePublicDocsCxt } from "../../contexts/public-docs-cxt";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { TableHeader } from "./components/TableHeader";
import { TableRow } from "./components/TableRow";

/**
 * Main public documents table component
 * Displays documents in a structured table format
 */
export const PublicDocsTable = () => {
  const { docs, isLoadingDocs } = usePublicDocsCxt();

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
    </div>
  );
};
