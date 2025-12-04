import ThemeDetailView from "@/modules/content-management-system/theme-details";
import { ThemesApi } from "@/services/api/company-dashboard/themes";
import { notFound } from "next/navigation";

// Enable static generation with dynamic params
export const dynamicParams = true;


export default async function ThemeDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const themeDataResponse = await ThemesApi.show(id);
  const themeDetailData = themeDataResponse.data?.payload ?? null;


  // If the theme not found, show 404
  if (!themeDetailData) {
    notFound();
  }

  return <ThemeDetailView initialData={themeDetailData} />
}
