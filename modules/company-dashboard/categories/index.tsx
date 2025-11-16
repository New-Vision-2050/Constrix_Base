"use client";
import { useState } from "react";
import { CompanyDashboardCategory } from "./types";
import SetCategoryDialog from "./set-category-dialog";

interface CompanyDashboardCategoriesModuleProps {
    categories: CompanyDashboardCategory[];
}
export default function CompanyDashboardCategoriesModule(props: CompanyDashboardCategoriesModuleProps) {
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

    return <div>
        <h1>Categories</h1>
        <SetCategoryDialog
            open={Boolean(editingCategoryId)}
            onClose={() => setEditingCategoryId(null)}
            categoryId={editingCategoryId || undefined}
        // onSuccess={() => reloadTable()}
        />
    </div>;
}