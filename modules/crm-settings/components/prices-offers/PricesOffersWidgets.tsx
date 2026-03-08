"use client";

import { useQuery } from "@tanstack/react-query";
import StatisticsCardHeader from "../../../organizational-structure/components/StatisticsCard/StatisticsCardHeader";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TopicIcon from "@mui/icons-material/Topic";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import TrendingUpSharpIcon from "@mui/icons-material/TrendingUpSharp";
import PaidIcon from "@mui/icons-material/Paid";
import { ClientRequestsApi } from "@/services/api/client-requests";
import type { PriceOfferWidget } from "@/services/api/client-requests/types/response";

const WIDGET_ICON_MAP: Record<string, React.ReactElement> = {
  total_client_requests: <PaidIcon color="success" />,
  pending_client_requests: <TopicIcon color="warning" />,
  accepted_client_requests: <TrendingUpSharpIcon color="success" />,
  rejected_client_requests: <EventBusyIcon color="error" />,
};

export default function PricesOffersWidgets() {
  const { data: widgetsData } = useQuery({
    queryKey: ["client-requests", "price-offer", "widgets"],
    queryFn: async () => {
      const response = await ClientRequestsApi.widgets();
      return response.data;
    },
  });

  const widgets = widgetsData?.payload ?? [];

  return (
    <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2 mb-4">
      {widgets.map((widget: PriceOfferWidget) => (
        <StatisticsCardHeader
          key={widget.code}
          title={widget.title}
          number={widget.total}
          description={
            widget.percentage !== undefined
              ? `(${widget.percentage}%${widget.percentage >= 0 ? "+" : ""})`
              : undefined
          }
          icon={
            WIDGET_ICON_MAP[widget.code] ?? (
              <CheckCircleIcon color="primary" />
            )
          }
        />
      ))}
    </div>
  );
}
