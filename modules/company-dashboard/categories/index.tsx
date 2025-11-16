import { CompanyDashboardCategory } from "./types";

interface CompanyDashboardCategoriesModuleProps {
    categories: CompanyDashboardCategory[];
}
export default function CompanyDashboardCategoriesModule(props: CompanyDashboardCategoriesModuleProps) {
    const { categories } = props;
    
    return <div>
        <h1>Categories</h1>
        <div>
            {categories.map((category) => (
                <div key={category.id}>{category.name}</div>
            ))}
        </div>
    </div>;
}