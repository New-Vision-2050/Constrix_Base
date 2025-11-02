import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface OrderStatusChipProps {
  status: string;
}

const statusConfig: Record<
  string,
  { color: string; bgColor: string }
> = {
  pending: {
    color: "text-yellow-700",
    bgColor: "bg-yellow-100 border-yellow-300",
  },
  confirmed: {
    color: "text-blue-700",
    bgColor: "bg-blue-100 border-blue-300",
  },
  processing: {
    color: "text-purple-700",
    bgColor: "bg-purple-100 border-purple-300",
  },
  out_for_delivery: {
    color: "text-indigo-700",
    bgColor: "bg-indigo-100 border-indigo-300",
  },
  delivered: {
    color: "text-green-700",
    bgColor: "bg-green-100 border-green-300",
  },
  returned: {
    color: "text-orange-700",
    bgColor: "bg-orange-100 border-orange-300",
  },
  failed: {
    color: "text-red-700",
    bgColor: "bg-red-100 border-red-300",
  },
  canceled: {
    color: "text-gray-700",
    bgColor: "bg-gray-100 border-gray-300",
  },
};

export function OrderStatusChip({ status }: OrderStatusChipProps) {
  const t = useTranslations("requests.status");
  
  const config = statusConfig[status] || {
    color: "text-gray-700",
    bgColor: "bg-gray-100 border-gray-300",
  };

  return (
    <Badge
      variant="outline"
      className={`${config.bgColor} ${config.color} font-medium px-3 py-1 text-xs`}
    >
      {t(status) || status}
    </Badge>
  );
}
