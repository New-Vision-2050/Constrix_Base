import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import InputDocName from "../InputDocName";
import { Pencil, Trash, Loader2, AlertTriangle, X } from "lucide-react";
import { useDocTypes } from "./useDocTypes";
import { useCreateDocType } from "./useCreateDocType";
import { useDeleteDocType } from "./useDeleteDocType";
import { DocType } from "./api/get-doc-types";
import LoadingCase from "./LoadingCase";
import ErrorCase from "./ErrorCase";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

export default function AddDocView() {
  // ** declare and define helper variables
  const [documentName, setDocumentName] = useState("");
  const [document, setDocument] = useState<DocType>();
  const { data: docTypes, isLoading, isError, refetch } = useDocTypes();
  const createDocTypeMutation = useCreateDocType();
  const deleteDocTypeMutation = useDeleteDocType();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const t = useTranslations("companyProfile.officialDocs.docsSettingsDialog");

  // handle save
  const handleSave = () => {
    const isEdit = Boolean(document?.id);

    if (documentName.trim()) {
      const mutationData = isEdit
        ? { id: document!.id, name: documentName.trim() }
        : { name: documentName.trim() };

      createDocTypeMutation.mutate(mutationData, {
        onSuccess: () => {
          setDocument(undefined);
          setDocumentName("");
        },
      });
    }
  };
  
  // handle delete
  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteDocTypeMutation.mutate(deleteConfirmId, {
        onSuccess: () => {
          setDeleteConfirmId(null);
          // Clear edit state if deleting the currently edited document
          if (document?.id === deleteConfirmId) {
            setDocument(undefined);
            setDocumentName("");
          }
        },
      });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleRefetch = () => {
    refetch();
  };

  // Loading state
  if (isLoading) return <LoadingCase />;

  // Error state
  if (isError) return <ErrorCase refetch={handleRefetch} />;

  return (
    <div className="flex flex-col gap-2 w-full p-4">
      {/* add new doc */}
      <div className="flex items-center gap-2">
        <InputDocName
          value={documentName}
          onChange={(str) => setDocumentName(str)}
          disabled={createDocTypeMutation.isPending}
          placeholder={t("docName")}
        />
        <Button
          onClick={handleSave}
          disabled={createDocTypeMutation.isPending || !documentName.trim()}
        >
          {createDocTypeMutation.isPending && (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          )}
          {document?.id ? t("update") : t("save")}
        </Button>
        {document?.id && (
          <X
            className={`h-4 w-4 text-white mr-2 ${createDocTypeMutation.isPending?'cursor-not-allowed': 'cursor-pointer'}`}
            onClick={(e) => {
              e.stopPropagation();
              setDocument(undefined);
              setDocumentName("");
            }}
          />
        )}
      </div>
      {/* docs list */}
      <div className="flex flex-col gap-2">
        {docTypes?.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between gap-2 py-1 px-2 border border-gray-500 rounded-lg"
          >
            {/* doc name */}
            <span>{doc.name}</span>
            {/* actions */}
            <div className="flex items-center">
              <Button
                onClick={() => {
                  setDocumentName(doc.name);
                  setDocument(doc);
                }}
                variant="ghost"
              >
                <Pencil className="text-pink-700" />
              </Button>
              <Button variant="ghost" onClick={() => handleDelete(doc.id)}>
                <Trash className="text-red-700" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={Boolean(deleteConfirmId)}
        onConfirm={confirmDelete}
        onClose={cancelDelete}
        title={t("deleteConfirmMessage")}
      />
    </div>
  );
}
