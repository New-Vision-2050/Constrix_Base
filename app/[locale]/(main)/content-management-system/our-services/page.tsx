import OurServicesModule from "@/modules/content-management-system/our-services";
import { CompanyDashboardOurServicesApi } from "@/services/api/company-dashboard/our-services";

export default async function OurServicesPage() {
  const { data } = await CompanyDashboardOurServicesApi.getCurrent();
  const initialData = data?.payload;
  return <OurServicesModule initialData={initialData} />;
}
