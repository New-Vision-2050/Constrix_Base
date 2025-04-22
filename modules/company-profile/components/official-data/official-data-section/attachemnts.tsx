import React from "react";
import { Button } from "@/components/ui/button";

interface Attachment {
  id: number;
  type: string;
  addedBy: string;
  date: string;
}

interface AttachmentsTableProps {
  attachments: Attachment[];
  className?: string;
}

const AttachmentsTable = ({
  attachments,
  className = "",
}: AttachmentsTableProps) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-sidebar text-start">
            <th className="p-4 text-start font-normal">م</th>
            <th className="p-4 text-start font-normal">نوع المرفق</th>
            <th className="p-4 text-start font-normal">تمت بواسطة</th>
            <th className="p-4 text-start font-normal">وقت الاضافة</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {attachments.map((attachment) => (
            <tr
              key={attachment.id}
              className="border border-gray-700"
            >
              <td className="p-4 text-start">{attachment.id}</td>
              <td className="p-4 text-start">{attachment.type}</td>
              <td className="p-4 text-start">{attachment.addedBy}</td>
              <td className="p-4 text-start">{attachment.date}</td>
              <td className="p-4">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-2 rounded-md">
                  تحميل
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const RequestAttachments = () => {
  const attachmentsData = [
    {
      id: 1,
      type: "غير محدد",
      addedBy: "العميل",
      date: "2024/04/22 01:30م",
    },
    {
      id: 2,
      type: "مستندات داعمة",
      addedBy: "الموظف",
      date: "2024/04/18 01:30م",
    },
    {
      id: 3,
      type: "رقم الهوية",
      addedBy: "العميل",
      date: "2024/04/25 03:00م",
    },
  ];

  return <AttachmentsTable attachments={attachmentsData} />;
};

export default RequestAttachments;
