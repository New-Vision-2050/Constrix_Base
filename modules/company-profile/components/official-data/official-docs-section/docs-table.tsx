"use client";

import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import FolderIcon from "@/public/icons/folder";
import ImageIcon from "@/public/icons/image-icon";
import { Trash } from "lucide-react";
import UserActivityLog from "./show-table";
import CopyButton from "@/components/shared/CopyButton";
import { CompanyDocument } from "@/modules/company-profile/types/company";
import { SheetFormBuilder } from "@/modules/form-builder";
import { useUpdateDocsFormConfig } from "./update-docs-form-config";
import { baseURL } from "@/config/axios-config";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PDFIcon from "@/assets/icons/PDF.png";

// Row component
const DocTableRow = ({
  doc,
  id,
  onSuccess,
}: {
  doc: CompanyDocument;
  id?: string;
  onSuccess?: () => void;
}) => {
  const [isOpenDelete, handleOpenDelete, handleCloseDelete] = useModal();
  const [isOpenShow, handleOpenShow, handleCloseShow] = useModal();

  const queryClient = useQueryClient();

  const config = useUpdateDocsFormConfig(doc, id, onSuccess);

  return (
    <>
      <tr>
        <td className="py-3 px-3 border-b">
          <div className="flex gap-2">
            <FolderIcon />
            {doc.document_type}
          </div>
        </td>
        <td className="py-3 px-3 border-b">{doc.name}</td>
        <td className="py-3 px-3 border-b">{doc.description}</td>
        <td className="py-3 px-3 border-b">
          <div className="flex gap-2 items-center">
            {doc.document_number ?? "-"}
            {doc.document_number && <CopyButton text={doc.document_number} />}
          </div>
        </td>
        <td className="py-3 px-3 border-b">{doc.start_date}</td>
        <td className="py-3 px-3 border-b">{doc.end_date}</td>
        <td className="py-3 px-3 border-b">{doc.notification_date}</td>
        <td className="py-3 px-3 border-b">
          <div className="flex items-center gap-1">
            {doc.files?.slice(0, 4).map((file) => {
              // Determine icon based on mime_type
              const getFileIcon = () => {
                if (file.mime_type.includes("pdf")) {
                  return (
                    <Image src={PDFIcon} alt="PDF" width={20} height={20} />
                  );
                } else if (file.mime_type.includes("image")) {
                  return <ImageIcon additionalClass="w-5 h-5 text-blue-500" />;
                } else {
                  return <FolderIcon />;
                }
              };

              return (
                <TooltipProvider key={file.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer"
                      >
                        {getFileIcon()}
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{file.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
            {doc.files && doc.files.length > 4 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs text-primary font-bold cursor-pointer">
                      ...
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{doc.files.length - 4} مرفقات إضافية</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {doc.files?.length > 0 && (
              <span className="text-xs text-gray-500 mr-1">
                ({doc.files.length})
              </span>
            )}
          </div>
        </td>
        <td className="py-3 px-3 border-b">
          <button onClick={handleOpenShow} className="text-primary underline">
            عرض
          </button>
        </td>
        <td className="py-3 px-3 border-b">
          <div className="flex gap-2 items-center">
            <SheetFormBuilder
              config={config}
              trigger={
                <button
                  disabled={Boolean(doc?.company_legal_data)}
                  className={`
                py-1 px-3 bg-[#72E128]/20  rounded-full
                ${
                  Boolean(doc?.company_legal_data)
                    ? "cursor-not-allowed text-gray-500"
                    : "text-[#72E128]"
                }
                `}
                >
                  تحديث
                </button>
              }
            />
            {/* company_legal_data */}
            <button
              onClick={handleOpenDelete}
              disabled={Boolean(doc?.company_legal_data)}
            >
              <Trash
                className={`
                w-4 ${
                  !Boolean(doc?.company_legal_data)
                    ? "text-red-500"
                    : "text-gray-500"
                }
                `}
              />
            </button>
          </div>
        </td>
      </tr>

      {/* Delete dialog specific to this row */}
      <DeleteConfirmationDialog
        deleteUrl={`${baseURL}/companies/company-profile/official-document/${
          doc.id
        }${!!id ? `?branch_id=${id}` : ""}`}
        onClose={handleCloseDelete}
        open={isOpenDelete}
        onSuccess={() => {
          queryClient.refetchQueries({
            queryKey: ["main-company-data", id],
          });
        }}
      />

      {/* Show dialog specific to this row */}
      <Dialog open={isOpenShow} onOpenChange={handleCloseShow}>
        <DialogContent withCrossButton className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-center my-5">الاحداث</DialogTitle>
          </DialogHeader>
          <UserActivityLog activities={doc.logs} />
        </DialogContent>
      </Dialog>
    </>
  );
};

// Main table component
const DocsTable = ({
  companyOfficialDocuments,
  id,
  onSuccess,
}: {
  companyOfficialDocuments: CompanyDocument[];
  id?: string;
  onSuccess?: () => void;
}) => {
  return (
    <div className="max-h-[500px] overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <td className="text-start p-3 border-b">نوع المستند</td>
            <td className="text-start p-3 border-b">أسم المستند</td>
            <td className="text-start p-3 border-b">وصف المستند</td>
            <td className="text-start p-3 border-b">رقم المستند</td>
            <td className="text-start p-3 border-b">تاريخ الاصدار</td>
            <td className="text-start p-3 border-b">تاريخ الانتهاء</td>
            <td className="text-start p-3 border-b">تاريخ الاشعار</td>
            <td className="text-start p-3 border-b">المرفقات</td>
            <td className="text-start p-3 border-b">الاحداث</td>
            <td className="text-start p-3 border-b">الاجراءات</td>
          </tr>
        </thead>
        <tbody>
          {companyOfficialDocuments.map((doc) => (
            <DocTableRow key={doc.id} doc={doc} id={id} onSuccess={onSuccess} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocsTable;
