import { ClientProfileData } from "@/app/[locale]/(main)/client-profile/[id]/types";
import ClientProfileHeader from "./components/ClientProfileHeader";
import ClientProfileStatisticsCards from "./components/statistics-cards";
import EmptyUserDataSection from "../dashboard/components/EmptyUserDataSection";
import { Button } from "@mui/material";
import { PlusIcon } from "lucide-react";

type PropsT = {
    profileData: ClientProfileData;
}

export default function ClientProfileModule({ profileData }: PropsT) {
    return (
        <div className="px-6 py-4 flex flex-col gap-4">
            <ClientProfileHeader profileData={profileData} />
            {/* grid have 3 columns in md and 1 column in xs*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* statistics cards */}
                <ClientProfileStatisticsCards />
                {/* user logs */}
                <EmptyUserDataSection title="سجل الانشطة" description="ليس لديك اي انشطة بعد" />
                {/* incoming meetings */}
                <EmptyUserDataSection title="الاجتماعات القادمة" description="ليس لديك اي اجتماعات قادمة بعد" actionsBtn={<Button variant="text" color="primary" startIcon={<PlusIcon />}>طلب اجتماع</Button>} />
            </div>
            {/* projects */}
            <EmptyUserDataSection title="المشاريع" description="ليس لديك اي مشاريع بعد" />
            {/* requests */}
            <EmptyUserDataSection title="الطلبات" description="ليس لديك اي طلبات بعد" />
            {/* price offers */}
            <EmptyUserDataSection title="عروض الأسعار" description="ليس لديك اي عروض اسعار بعد" />
            {/* contracts */}
            <EmptyUserDataSection title="العقود" description="ليس لديك اي عقود بعد" />
        </div>
    );
}