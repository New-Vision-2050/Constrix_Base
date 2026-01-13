"use client";
import { useState } from "react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import {
  Box,
  Stack,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import withPermissions from "@/lib/permissions/client/withPermissions";
import HeadlessTableLayout from "@/components/headless/table";
import { ProductRow } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { ProductsApi } from "@/services/api/ecommerce/products";
import { ECM_Product } from "@/types/api/ecommerce/product";
import { getProductsColumns } from "./columns";
import { useRouter } from "@i18n/navigation";
import StatisticsStoreRow from "@/components/shared/layout/statistics-store";
import { statisticsConfig } from "./add/components/statistics-config";
import CustomMenu from "@/components/headless/custom-menu";
import { EditIcon, Trash2 } from "lucide-react";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { useQueryClient } from "@tanstack/react-query";

const PRODUCTS_QUERY_KEY = "stores-products";

// Create typed table instance
const ProductsTableLayout = HeadlessTableLayout<ProductRow>();

function ProductsTable() {
  const router = useRouter();
  const t = useTranslations();
  const queryClient = useQueryClient();

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Delete dialog state
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // ✅ STEP 1: useTableParams (BEFORE query)
  const params = ProductsTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 5,
  });

  // ✅ STEP 2: Fetch data using useQuery
  const { data: queryData, isLoading } = useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, params.page, params.limit, searchQuery],
    queryFn: async () => {
      const response = await ProductsApi.list({
        search: searchQuery,
      });

      const products =
        (response.data.payload as unknown as ECM_Product[]) || [];
      const pagination = response.data.pagination;

      return {
        data: products,
        totalPages: pagination?.last_page ?? 1,
        totalItems: pagination?.result_count ?? products.length,
      };
    },
  });

  const data = queryData?.data || [];
  const totalPages = queryData?.totalPages || 0;
  const totalItems = queryData?.totalItems || 0;

  // Define columns
  const columns = [
    ...getProductsColumns(t),
    {
      key: "actions",
      name: t("product.tableActions"),
      sortable: false,
      render: (row: ProductRow) => (
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <Button onClick={onClick}>{t("product.tableActions")}</Button>
          )}
        >
          <MenuItem
            onClick={() => {
              handleEditProduct(row.id);
            }}
          >
            <EditIcon className="w-4 h-4 ml-2" />
            {t("product.edit")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setDeletingAddressId(row.id);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4 ml-2" />
            {t("product.delete")}
          </MenuItem>
        </CustomMenu>
      ),
    },
  ];

  // ✅ STEP 3: useTableState (AFTER query)
  const state = ProductsTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (product: ProductRow) => product.id,
    loading: isLoading,
    filtered: searchQuery !== "",
  });

  const handleAddProduct = () => {
    router.push("/stores/products/add");
  };

  const handleEditProduct = (productId: string) => {
    router.push(`/stores/products/edit/${productId}`);
  };

  return (
    <>
      <StatisticsStoreRow config={statisticsConfig} />
      <Box sx={{ p: 3 }}>
        <ProductsTableLayout
          filters={
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ my: 4 }}>
                {t("product.plural")}
              </Typography>
              {/* Filter Controls */}
              <Grid container spacing={2}>
                <Grid size={{ md: 10 }}>
                  <TextField
                    size="small"
                    placeholder={t("labels.search")}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      params.setPage(1);
                    }}
                    InputProps={{
                      startAdornment: (
                        <Search sx={{ mr: 1, color: "action.active" }} />
                      ),
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ md: 2 }}>
                  <Can check={[PERMISSIONS.ecommerce.product.create]}>
                    <Button
                      variant="contained"
                      onClick={handleAddProduct}
                      fullWidth
                    >
                      {t("labels.add")} {t("product.singular")}
                    </Button>
                  </Can>
                </Grid>
              </Grid>
            </Stack>
          }
          table={
            <ProductsTableLayout.Table
              state={state}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<ProductsTableLayout.Pagination state={state} />}
        />
        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          deleteUrl={`/api/ecommerce/products/${deletingAddressId}`}
          onClose={() => {
            setDeleteDialogOpen(false);
            setDeletingAddressId(null);
          }}
          open={deleteDialogOpen}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
            setDeleteDialogOpen(false);
            setDeletingAddressId(null);
          }}
        />
      </Box>
    </>
  );
}

export default withPermissions(ProductsTable, [
  PERMISSIONS.ecommerce.product.list,
]);
