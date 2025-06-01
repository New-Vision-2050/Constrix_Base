import React from "react";
import { Button } from "@/components/ui/button";
import { AdminRequest } from "@/types/admin-request";
import { format, parse } from 'date-fns';
import { downloadFile } from "@/utils/downloadFile";


const RequestAttachments = ({request}:{request: AdminRequest | null}) => {
  const attachments = request?.attachments || [];
  const parsedDate = parse(request?.created_at ?? "", 'yyyy-MM-dd HH:mm:ss', new Date());
  const formatted = format(parsedDate, 'yyyy/MM/dd hh:mma');

  return  (
  <div className={`w-full overflow-x-auto `}>
    {attachments.length === 0 ?      
      <div className="text-center text-gray-500 bg-gray-100/10 rounded-lg p-4">
        لا توجد مرفقات لهذا الطلب
      </div>
            :  <table className="w-full border-collapse">
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
              <td className="p-4 text-start">غير محدد</td>
              <td className="p-4 text-start">{request?.user_name}</td>
              <td className="p-4 text-start">{formatted}</td>
              <td className="p-4">
                <Button 
                  onClick={() => downloadFile(attachment)}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-2 rounded-md"
                >
                  تحميل
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> }
    
    </div>
    )
};

export default RequestAttachments;
