import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import TheStatus from "../components/the-status";
import { TableConfig } from "@/modules/table";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface MainPageRow {
  id: string;
  name: string;
  type: string;
  image: string;
  is_active: boolean;
}

type Params = {
  onEdit?: (id: string) => void;
};

export const useMainPageTableConfig: (params?: Params) => TableConfig = (
  params
) => {
  const t = useTranslations();

  return {
    tableId: "main-page-list-table",
    url: `${baseURL}/ecommerce/dashboard/pages/main`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/pages/main`,
    columns: [
      {
        key: "name",
        label: "الاسم",
        sortable: true,
        render: (_: unknown, row: MainPageRow) => (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
              {row.image ? (
                <Image
                  src={row.image}
                  alt={row.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-gray-400 text-xs">لا صورة</span>
              )}
            </div>
            <span>{row.name}</span>
          </div>
        ),
      },
      {
        key: "type",
        label: "النوع",
        sortable: true,
      },

      {
        key: "is_active",
        label: "الحالة",
        render: (value: "active" | "inActive", row: MainPageRow) => (
          <TheStatus theStatus={value} id={row.id} type="main" />
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
