import { Badge } from "@/components/ui/badge";
import { useLocale } from "next-intl";

interface OrderStatusChipProps {
  status: string;
}

const statusConfig: Record<
  string,
  { label: string; labelAr: string; color: string; bgColor: string }
> = {
  pending: {
    label: "Pending",
    labelAr: "قيد الانتظار",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100 border-yellow-300",
  },
  confirmed: {
    label: "Confirmed",
    labelAr: "مؤكد",
    color: "text-blue-700",
    bgColor: "bg-blue-100 border-blue-300",
  },
  processing: {
    label: "Processing",
    labelAr: "قيد المعالجة",
    color: "text-purple-700",
    bgColor: "bg-purple-100 border-purple-300",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    labelAr: "خارج للتوصيل",
    color: "text-indigo-700",
    bgColor: "bg-indigo-100 border-indigo-300",
  },
  delivered: {
    label: "Delivered",
    labelAr: "تم التوصيل",
    color: "text-green-700",
    bgColor: "bg-green-100 border-green-300",
  },
  returned: {
    label: "Returned",
    labelAr: "مرتجع",
    color: "text-orange-700",
    bgColor: "bg-orange-100 border-orange-300",
  },
  failed: {
    label: "Failed",
    labelAr: "فشل",
    color: "text-red-700",
    bgColor: "bg-red-100 border-red-300",
  },
  canceled: {
    label: "Canceled",
    labelAr: "ملغي",
    color: "text-gray-700",
    bgColor: "bg-gray-100 border-gray-300",
  },
};

export function OrderStatusChip({ status }: OrderStatusChipProps) {
  const locale = useLocale();
  
  const config = statusConfig[status] || {
    label: status,
    labelAr: status,
    color: "text-gray-700",
    bgColor: "bg-gray-100 border-gray-300",
  };

  return (
    <Badge
      variant="outline"
      className={`${config.bgColor} ${config.color} font-medium px-3 py-1 text-xs`}
    >
      {locale === "ar" ? config.labelAr : config.label}
    </Badge>
  );
}
