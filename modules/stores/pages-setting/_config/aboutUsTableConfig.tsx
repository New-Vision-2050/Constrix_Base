import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import TheStatus from "../components/the-status";
import { TableConfig } from "@/modules/table";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface AboutUsRow {
  id: string;
  name: string;
  type: string;
  image: string;
  is_active: boolean;
}

type Params = {
  onEdit?: (id: string) => void;
};

export const useAboutUsTableConfig: (params?: Params) => TableConfig = (
  params
) => {
  const t = useTranslations();

  return {
    tableId: "about-us-list-table",
    url: `${baseURL}/ecommerce/dashboard/pages/about-us`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/pages/about-us`,
    columns: [
      {
        key: "name",
        label: "الاسم",
        sortable: true,
      },
      {
        key: "type",
        label: "النوع",
        sortable: true,
      },
      {
        key: "image",
        label: "الصورة",
        render: (value: string) => (
          <img
            src={value}
            alt="Page"
            className="w-12 h-12 object-cover rounded"
          />
        ),
      },
      {
        key: "is_active",
        label: "الحالة",
        render: (value: "active" | "inActive", row: AboutUsRow) => (
          <TheStatus theStatus={value} id={row.id} type="about-us" />
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
