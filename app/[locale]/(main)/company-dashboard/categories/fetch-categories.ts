import { apiClient, baseURL } from "@/config/axios-config";
import { CompanyDashboardCategory } from "@/modules/company-dashboard/categories/types";

export async function fetchCategories() {
    try {
        // const response = await apiClient.get(`${baseURL}/ecommerce/dashboard/categories`);
        // return response.data.payload;

        // current temp solution
        const categories: CompanyDashboardCategory[] = [
            {
                id: "1",
                name: "Category 1",
                type: "category",
            },
            {
                id: "2",
                name: "Category 2",
                type: "subcategory",
            },
            {
                id: "3",
                name: "Category 3",
                type: "subcategory",
            },
            {
                id: "4",
                name: "Category 4",
                type: "subcategory",
            },
            {
                id: "5",
                name: "Category 5",
                type: "subcategory",
            }
        ];
        return categories;
    } catch (error) {
        console.error(error);
        return null;
    }
}