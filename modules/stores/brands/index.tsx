"use client";
import { useState } from "react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Box, Button, Typography, MenuItem } from "@mui/material";
import { useTranslations } from "next-intl";
import withPermissions from "@/lib/permissions/client/withPermissions";
import HeadlessTableLayout from "@/components/headless/table";
import { BrandRow } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { BrandsApi } from "@/services/api/ecommerce/brands";
import { ECM_Brand } from "@/types/api/ecommerce/brand";

// Extended brand type that includes the missing properties
interface ExtendedBrand extends ECM_Brand {
  is_active?: number;
  num_products?: number;
  num_requests?: number;
}
import { getBrandsColumns } from "./columns";
import StatisticsStoreRow from "@/components/shared/layout/statistics-store";
import { statisticsConfig } from "./component/statistics-config";
import CustomMenu from "@/components/headless/custom-menu";
import { EditIcon, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import AddBrandDialog from "@/modules/stores/components/dialogs/add-brand";
import DeleteButton from "@/components/shared/delete-button";
import DialogTrigger from "@/components/headless/dialog-trigger";

const BRANDS_QUERY_KEY = "stores-brands";

// Create typed table instance
const BrandsTableLayout = HeadlessTableLayout<BrandRow>("sbr");

function BrandsTable() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  // Delete dialog state
  const [deletingBrandId, setDeletingBrandId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Edit dialog state
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);

  // ✅ STEP 1: useTableParams (BEFORE query)
  const params = BrandsTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 5,
  });

  // ✅ STEP 2: Fetch data using useQuery
  const { data: queryData, isLoading } = useQuery({
    queryKey: [BRANDS_QUERY_KEY, params.page, params.limit, params.search],
    queryFn: async () => {
      const response = await BrandsApi.list({
        search: params.search,
      });

      const brands = response.data.payload || [];
      const pagination = response.data.pagination;

      // Transform ECM_Brand to BrandRow
      const transformedBrands: BrandRow[] = brands.map(
        (brand: ExtendedBrand) => ({
          ...brand,
          is_active: brand.is_active ?? 1, // Default to active if not provided
          num_products: brand.num_products ?? 0, // Default to 0 if not provided
          num_requests: brand.num_requests ?? 0, // Default to 0 if not provided
        }),
      );

      return {
        data: transformedBrands,
        totalPages: pagination?.last_page ?? 1,
        totalItems: pagination?.result_count ?? brands.length,
      };
    },
  });

  const data = queryData?.data || [];
  const totalPages = queryData?.totalPages || 0;
  const totalItems = queryData?.totalItems || 0;

  // Define columns
  const columns = [
    ...getBrandsColumns(t),
    {
      key: "actions",
      name: t("product.tableActions"),
      sortable: false,
      render: (row: BrandRow) => (
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <Button onClick={onClick}>{t("product.tableActions")}</Button>
          )}
        >
          <MenuItem
            onClick={() => {
              handleEditBrand(row.id);
            }}
          >
            <EditIcon className="w-4 h-4 ml-2" />
            {t("labels.edit")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setDeletingBrandId(row.id);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4 ml-2" />
            {t("labels.delete")}
          </MenuItem>
        </CustomMenu>
      ),
    },
  ];

  // ✅ STEP 3: useTableState (AFTER query)
  const state = BrandsTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (brand: BrandRow) => brand.id,
    loading: isLoading,
    searchable: true,
    filtered: params.search !== "",
  });

  const handleEditBrand = (brandId: string) => {
    setEditingBrandId(brandId);
  };

  return (
    <>
      <StatisticsStoreRow config={statisticsConfig} />
      <Box sx={{ p: 3 }}>
        <BrandsTableLayout
          filters={
            <BrandsTableLayout.TopActions
              state={state}
              customActions={
                <Can check={[PERMISSIONS.ecommerce.brand.create]}>
                  <DialogTrigger
                    component={AddBrandDialog}
                    dialogProps={{
                      brandId: undefined,
                      onSuccess: () => {
                        queryClient.invalidateQueries({
                          queryKey: [BRANDS_QUERY_KEY],
                        });
                      },
                    }}
                    render={({ onOpen }) => (
                      <Button variant="contained" onClick={onOpen}>
                        {t("labels.add")} {t("brand.singular")}
                      </Button>
                    )}
                  />
                </Can>
              }
            >
              <Typography variant="h6" sx={{ my: 4 }}>
                {t("brand.plural")}
              </Typography>
            </BrandsTableLayout.TopActions>
          }
          table={
            <BrandsTableLayout.Table
              state={state}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<BrandsTableLayout.Pagination state={state} />}
        />
        {/* Delete Confirmation Dialog */}
        <DeleteButton
          message={t("brand.deleteConfirm")}
          onDelete={async () => {
            await BrandsApi.delete(deletingBrandId!);
            queryClient.invalidateQueries({ queryKey: [BRANDS_QUERY_KEY] });
            setDeleteDialogOpen(false);
            setDeletingBrandId(null);
          }}
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          translations={{
            deleteSuccess: t("labels.deleteSuccess"),
            deleteError: t("labels.deleteError"),
            deleteCancelled: t("labels.deleteCancelled"),
          }}
        />

        {/* Add/Edit Brand Dialog */}
        <Can check={[PERMISSIONS.ecommerce.brand.update]}>
          <AddBrandDialog
            open={Boolean(editingBrandId)}
            onClose={() => setEditingBrandId(null)}
            brandId={
              editingBrandId === "new" || !editingBrandId
                ? undefined
                : editingBrandId
            }
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: [BRANDS_QUERY_KEY] });
              setEditingBrandId(null);
            }}
          />
        </Can>
      </Box>
    </>
  );
}

export default withPermissions(BrandsTable, [PERMISSIONS.ecommerce.brand.list]);
