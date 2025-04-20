import { Card } from "@/components/ui/card";
import React from "react";

interface RequestDetailProps {
  id: string;
  date: string;
  companyName: string;
  region: string;
  serviceType: string;
  notes: string;
  className?: string;
}

const ReqDetails = () => {
  const requestData = {
    id: "1486322",
    date: "2024/04/22 01:30م",
    companyName: "نيو فيجن",
    region: "الرياض",
    serviceType: "تعديل بيانات قانونية",
    notes: "تعديل البيانات المدخلة",
  };

  return (
    <RequestDetails
      id={requestData.id}
      date={requestData.date}
      companyName={requestData.companyName}
      region={requestData.region}
      serviceType={requestData.serviceType}
      notes={requestData.notes}
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
