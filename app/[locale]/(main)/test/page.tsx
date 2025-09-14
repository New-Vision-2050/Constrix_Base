"use client";

import React from "react";
import AddWarehouseExample from "@/modules/stores/components/dialogs/add-warehouse/example";
import AddOrderDiscountExample from "@/modules/stores/components/dialogs/add-order-discount/example";
import ProductsInDiscountExample from "@/modules/stores/components/dialogs/products-in-discount/example";
import AddDiscountCouponExample from "@/modules/stores/components/dialogs/add-discount-coupon/example";
import AddWarehouse2Example from "@/modules/stores/components/dialogs/add-warehouse-2/example";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddProductDialog from "@/modules/stores/components/dialogs/add-product";
import { Button } from "@/components/ui/button";
import SimpleSelect from "@/components/headless/select";

export default function AdvancedRolePermissionsExamplePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        Advanced Role & Permissions Management Example
      </h1>
      <p className="mb-6">
        This page demonstrates an advanced implementation of a role and
        permissions management form using the form builder with &quot;Select
        All&quot; functionality for each permission group.
      </p>

      <AddWarehouseExample />
      <AddOrderDiscountExample />
      <ProductsInDiscountExample />
      <AddDiscountCouponExample />
      <AddWarehouse2Example />
      <DialogTrigger
        component={AddProductDialog}
        dialogProps={{}}
        render={({ onOpen }) => (
          <Button onClick={onOpen}>Open Product Add</Button>
        )}
      />
      <SimpleSelect />
    </div>
  );
}
