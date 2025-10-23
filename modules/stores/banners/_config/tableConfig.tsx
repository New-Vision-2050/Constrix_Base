import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import TheStatus from "../component/the-status";

interface BannerRow {
  id: string;
  name: string;
  type: string;
  file?: {
    id: number;
    url: string;
    name: string;
    mime_type: string;
    type: string;
  };
  is_active: "active" | "inActive";
}

type Params = {
  onEdit?: (id: string) => void;
};

export const useBannerTableConfig: (params?: Params) => TableConfig = (
  params
) => {
  const t = useTranslations();

  return {
    tableId: "banners-list-table",
    url: `${baseURL}/ecommerce/dashboard/banners`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/banners`,
    columns: [
      {
        key: "name",
        label: "الاسم",
        sortable: true,
        render: (_: unknown, row: BannerRow) => (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
              {row.file?.url ? (
                <Image
                  src={row.file.url}
                  alt={row.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-gray-400 text-xs">{t("labels.image")}</div>
              )}
            </div>
            <span className="font-medium">{row.name}</span>
          </div>
        ),
      },
      {
        key: "type",
        label: "النوع",
      },
      {
        key: "is_active",
        label: "الحالة",
        render: (value: "active" | "inActive", row: BannerRow) => (
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
