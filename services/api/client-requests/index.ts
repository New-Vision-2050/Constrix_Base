import { baseApi } from "@/config/axios/instances/base";
import {
  ListClientRequestsResponse,
  PriceOfferWidgetsResponse,
} from "./types/response";
import { ClientRequestListParams } from "./types/params";

export const ClientRequestsApi = {
  list: (params?: ClientRequestListParams) =>
    baseApi.get<ListClientRequestsResponse>("client-requests", {
      params,
    }),
  widgets: () =>
    baseApi.get<PriceOfferWidgetsResponse>(
      "client-requests/price-offer/widgets"
    ),
};
