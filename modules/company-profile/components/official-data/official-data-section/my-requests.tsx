// pages/index.tsx
import { useState } from "react";
import { Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import { DialogTitle } from "@radix-ui/react-dialog";
import TabsGroup from "@/components/shared/TabsGroup";
import ReqDetails from "./req-details";
import RequestAttachments from "./attachemnts";
import RequestHistory from "./history";
import { useAdminRequests } from "@/modules/company-profile/query/useAdminRequests";
import { AdminRequest, AdminRequestType, RequestStatus } from "@/types/admin-request";
import { Loader2 } from "lucide-react";

export default function MyRequests({type , company_id, branch_id}: {type: AdminRequestType, company_id: string, branch_id?: string}) {
    const [isOpenReqDetails, handleOpenReqDetails, handleCloseReqDetails] =
    useModal();

  const {data , isLoading, error , isPending , isFetching} = useAdminRequests({
    type,
    company_id,
    branch_id,
  })

  const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);

  const handleSelectRequest = (request: AdminRequest) => {
    setSelectedRequest(request);
    handleOpenReqDetails();
  }



  const getStatusText = (status: RequestStatus) => {
    switch (status) {
      case -1:
        return "تحت التدقيق";
      case 0:
        return "مرفوض";
      case 1:
        return "مقبول";
      default:
        return "تحت التدقيق";
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case -1:
        return "bg-[#211732] text-[#F19B02]";
      case 0:
        return "bg-[#490F00] text-[#FF4747]";
      case 1:
        return "bg-green-600/30 text-[#72E128]";
      default:
        return "bg-[#211732] text-[#F19B02]";
    }
  };

  return (
    <>
      <div className="mt-4 flex flex-col items-center">
        <div className="w-full max-w-md space-y-8 mt-4 max-h-[calc(80vh-120px)] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 bg-red-100/10 rounded-lg p-4">
              حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة مرة أخرى
            </div>
          ) : !data || data.length === 0 ? (
            <div className="text-center text-gray-500 bg-gray-100/10 rounded-lg p-4">
              لا توجد طلبات متاحة
            </div>
          ) : data.map((request) => (
            <Card
              key={request.id}
              className="border relative bg-transparent rounded-xl p-4"
            >
              <div className="absolute top-0 -translate-y-1/2 bg-sidebar rounded-md px-2">
                <h3 title={request.action} className="text-sm font-medium text-lines opacity-40 line-clamp-2 max-w-[290px] ">
                  رقم الطلب {request.id} - {request.action}
                </h3>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center">
                  <span className="ml-2 ">الحالة</span>
                  <Badge
                    variant={"outline"}
                    className={`mr-2 rounded-full border-none  ${getStatusColor(
                      request.status
                    )}  px-4 py-1 text-sm font-medium`}
                  >
                    {getStatusText(request.status)}
                  </Badge>
                </div>{" "}
                <button
                  onClick={()=>handleSelectRequest(request)}
                  className="text-pink-500"
                >
                  <Eye size={18} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Dialog open={isOpenReqDetails} onOpenChange={handleCloseReqDetails}>
        <DialogContent withCrossButton className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-center my-5">
              عرض تفاصيل الطلب
            </DialogTitle>
          </DialogHeader>
          <TabsGroup
            defaultValue="details"
            variant="secondary"
            tabs={[
              {
                value: "details",
                label: "تفاصيل الطلب",
                component: <ReqDetails request={selectedRequest} />,
              },
              {
                value: "attached",
                label: "المرفقات",
                component: <RequestAttachments request={selectedRequest} />,
              },
              {
                value: "history",
                label: "سجل العمليات",
                component: <RequestHistory request={selectedRequest} />,
              },
            ]}
            tabsTriggerClassNames="!bg-transparent px-20"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
