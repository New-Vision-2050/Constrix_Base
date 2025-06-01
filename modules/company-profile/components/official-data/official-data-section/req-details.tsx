import { Card } from "@/components/ui/card";
import { AdminRequest } from "@/types/admin-request";
import { format, parse } from 'date-fns';

interface RequestDetailProps {
  id: string;
  date: string;
  companyName: string;
  region: string;
  serviceType: string;
  notes: string;
  className?: string;
}

const ReqDetails = ({request}:{request: AdminRequest | null}) => {
  if (!request) return null;

const parsedDate = parse(request.created_at, 'yyyy-MM-dd HH:mm:ss', new Date());
const formatted = format(parsedDate, 'yyyy/MM/dd hh:mma');

  return (
    <RequestDetails
      id={request.id}
      date={formatted}
      companyName={request.company_name}
      region={request.data.country_id || "-"}
      serviceType={request.action}
      notes={request.notes}
      className="w-full mx-auto"
    />
  );
};

function RequestDetails({
  id,
  date,
  companyName,
  region,
  serviceType,
  notes,
  className = "",
}: RequestDetailProps) {
  const detailRows = [
    { label: "رقم الطلب", value: id },
    { label: "تاريخ الطلب", value: date },
    { label: "اسم المنشأة", value: companyName },
    { label: "المنطقة", value: region },
    { label: "نوع الخدمة", value: serviceType },
    { label: "ملاحظاتي", value: notes },
  ];

  return (
    <Card
      className={`border bg-transparent rounded-lg overflow-hidden ${className}`}
    >
      <div className="flex flex-col">
        {detailRows.map((row, index) => (
          <div key={index} className="flex group">
            <div className="w-1/3 bg-sidebar p-4 text-right font-medium">
              {row.label}
            </div>
            <div className="w-2/3 p-4 text-right border-b group-last:border-b-0">
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default ReqDetails;
