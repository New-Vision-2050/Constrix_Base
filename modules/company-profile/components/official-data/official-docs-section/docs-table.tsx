"use client";

import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import CopyIcon from "@/public/icons/copy";
import FolderIcon from "@/public/icons/folder";
import { Trash } from "lucide-react";
import UserActivityLog from "./show-table";
import CopyButton from "@/components/shared/CopyButton";
import { CompanyDocument } from "@/modules/company-profile/types/company";
import { useState } from "react";
import { SheetFormBuilder } from "@/modules/form-builder";
import { updateDocsFormConfig } from "./update-docs-form-config";
import { baseURL } from "@/config/axios-config";
import { useQueryClient } from "@tanstack/react-query";

// Row component
const DocTableRow = ({ doc, id }: { doc: CompanyDocument; id?: string }) => {
  const [isOpenDelete, handleOpenDelete, handleCloseDelete] = useModal();
  const [isOpenShow, handleOpenShow, handleCloseShow] = useModal();

  const queryClient = useQueryClient();

  return (
    <>
      <tr key={doc.id}>
        <td className="py-3 px-3 border-b">
          <div className="flex gap-2">
            <FolderIcon />
            {doc.name}
          </div>
        </td>
        <td className="py-3 px-3 border-b">{doc.description}</td>
        <td className="py-3 px-3 border-b">
          <div className="flex gap-2 items-center">
            {doc.document_number} <CopyButton text={doc.document_number} />
          </div>
        </td>
        <td className="py-3 px-3 border-b">{doc.start_date}</td>
        <td className="py-3 px-3 border-b">{doc.end_date}</td>
        <td className="py-3 px-3 border-b">{doc.notification_date}</td>
        <td className="py-3 px-3 border-b">{doc.files?.length} مرفقات</td>
        <td className="py-3 px-3 border-b">
          <button onClick={handleOpenShow} className="text-primary underline">
            عرض
          </button>
        </td>
        <td className="py-3 px-3 border-b">
          <div className="flex gap-2 items-center">
            <SheetFormBuilder
              config={updateDocsFormConfig(doc)}
              trigger={
                <button className="py-1 px-3 bg-[#72E128]/20 text-[#72E128] rounded-full">
                  تحديث
                </button>
              }
            />
            <button onClick={handleOpenDelete}>
              <Trash className="w-4 text-red-500" />
            </button>
          </div>
        </td>
      </tr>

      {/* Delete dialog specific to this row */}
      <DeleteConfirmationDialog
        deleteUrl={`${baseURL}/companies/company-profile/official-document/${doc.id}`}
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
}: {
  companyOfficialDocuments: CompanyDocument[];
}) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <td className="text-start p-3 border-b">الاسم</td>
          <td className="text-start p-3 border-b">الوصف</td>
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
          <DocTableRow key={doc.id} doc={doc} />
        ))}
      </tbody>
    </table>
  );
};

export default DocsTable;
