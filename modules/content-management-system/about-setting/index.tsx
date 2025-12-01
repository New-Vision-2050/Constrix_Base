import { AboutUsData } from "@/services/api/company-dashboard/about/types/response";
import AboutSettingForm from "./components/AboutSettingForm";

export default function AboutSettingView({ initialData }: { initialData: AboutUsData | null }) {
    return (
        <div className="px-6 py-2 flex flex-col gap-4">
            <AboutSettingForm initialData={initialData} />
        </div>
    );
}
