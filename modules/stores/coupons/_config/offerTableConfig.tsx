import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import TheStatus from "@/modules/bouquet/components/the-status";
import { TableConfig } from "@/modules/table";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface OfferRow {
  id: string;
  title: string;
  start_date: string;
  expire_date: string;
  is_active: "active" | "inActive";
  file?: {
    url: string;
  };
}

type Params = {
  onEdit?: (id: string) => void;
};

export const useOfferTableConfig: (params?: Params) => TableConfig = (
  params
) => {
  const t = useTranslations();

  return {
    tableId: "offers-list-table",
    url: `${baseURL}/ecommerce/dashboard/flash_deals`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/flash_deals`,
    columns: [
      {
        key: "title",
        label: t("offer.table.title"),
        sortable: true,
        render: (_: unknown, row: OfferRow) => (
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
                <span className="text-gray-400 text-xs">{t("offer.table.noImage")}</span>
              )}
            </div>
            <span>{row.title}</span>
          </div>
        ),
      },
      {
        key: "start_date",
        label: t("offer.table.startDate"),
      },
      {
        key: "expire_date",
        label: t("offer.table.endDate"),
      },
      {
        key: "is_active",
        label: t("offer.table.status"),
        render: (value: "active" | "inActive", row: OfferRow) => (
          <TheStatus theStatus={value} id={row.id} />
        ),
      },
    ],
    executions: [
      (row) => (
        <DropdownMenuItem onSelect={() => params?.onEdit?.(row.id)}>
          <EditIcon />
          {t("labels.edit")}
        </DropdownMenuItem>
      ),
    ],
    executionConfig: {
      canDelete: true,
    },
  };
};
