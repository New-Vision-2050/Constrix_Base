import Image from "next/image";
import TheStatus from "@/modules/bouquet/components/the-status";

export interface OfferRow {
  id: string;
  title: string;
  start_date: string;
  expire_date: string;
  is_active: "active" | "inActive";
  file?: {
    url: string;
  };
}

export const getOfferColumns = (t: (key: string) => string) => [
  {
    key: "title",
    name: t("offer.table.title"),
    sortable: true,
    render: (row: OfferRow) => (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
          {row.file?.url ? (
            <Image
              src={row.file.url}
              alt={row.title}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-gray-400 text-xs">
              {t("offer.table.noImage")}
            </span>
          )}
        </div>
        <span className="text-sm font-medium">{row.title}</span>
      </div>
    ),
  },
  {
    key: "start_date",
    name: t("offer.table.startDate"),
    sortable: false,
    render: (row: OfferRow) => (
      <span className="text-sm">{row.start_date || "-"}</span>
    ),
  },
  {
    key: "expire_date",
    name: t("offer.table.endDate"),
    sortable: false,
    render: (row: OfferRow) => (
      <span className="text-sm">{row.expire_date || "-"}</span>
    ),
  },
  {
    key: "is_active",
    name: t("offer.table.status"),
    sortable: false,
    render: (row: OfferRow) => (
      <TheStatus theStatus={row.is_active} id={row.id} />
    ),
  },
];
