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

interface Request {
  id: string;
  type: "تعديل بيانات رسمية" | "تعديل ملف الشركة";
  status: "مرسل" | "تحت التدقيق" | "مرفوض للتعديل" | "مرفوض" | "مقبول";
}

export default function MyRequests() {
  const [isOpenReqDetails, handleOpenReqDetails, handleCloseReqDetails] =
    useModal();

  console.log({ isOpenReqDetails });

  const [requests] = useState<Request[]>([
    { id: "5400532", type: "تعديل بيانات رسمية", status: "مرسل" },
    { id: "5486532", type: "تعديل ملف الشركة", status: "تحت التدقيق" },
    { id: "5486577", type: "تعديل ملف الشركة", status: "مرفوض للتعديل" },
    { id: "5486577", type: "تعديل ملف الشركة", status: "مرفوض" },
    { id: "5400532", type: "تعديل بيانات رسمية", status: "مقبول" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مرسل":
        return "bg-green-600/30 text-[#72E128]";
      case "تحت التدقيق":
        return "bg-[#211732] text-[#F19B02]";
      case "مرفوض للتعديل":
        return "bg-[#490F00] text-[#FF4747] ";
      case "مرفوض":
        return "bg-[#490F00] text-[#FF4747] ";
      case "مقبول":
        return "bg-green-600/30 text-[#72E128]";
      default:
        return "bg-green-600/30 text-[#72E128]";
    }
  };

  return (
    <>
      <div className=" mt-4 flex flex-col items-center">
        <div className="w-full max-w-md space-y-6">
          {requests.map((request, index) => (
            <Card
              key={index}
              className="border relative bg-transparent rounded-xl p-4"
            >
              <div className="absolute top-0 -translate-y-1/2 bg-sidebar px-2">
                <h3 className="text-sm font-medium text-lines opacity-40 ">
                  رقم الطلب {request.id} - {request.type}
                </h3>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <span className="ml-2 ">الحالة</span>
                  <Badge
                    variant={"outline"}
                    className={`mr-2 rounded-full border-none  ${getStatusColor(
                      request.status
                    )}  px-4 py-1 text-sm font-medium`}
                  >
                    {request.status}
                  </Badge>
                </div>{" "}
                <button
                  onClick={handleOpenReqDetails}
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
                component: <ReqDetails />,
              },
              {
                value: "attached",
                label: "المرفقات",
                component: <RequestAttachments />,
              },
              {
                value: "history",
                label: "سجل العمليات",
                component: <RequestHistory />,
              },
            ]}
            tabsTriggerClassNames="!bg-transparent px-20"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
