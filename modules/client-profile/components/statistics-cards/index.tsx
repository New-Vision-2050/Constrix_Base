import EmptyStatisticsCard from "@/modules/dashboard/components/statistics-cards/components/empty-card";

export default function ClientProfileStatisticsCards() {
    return (
        <div className="flex flex-col gap-4">
            <EmptyStatisticsCard
                title="بيان مالي للعقود"
                description="لا يوجد بيانات"
            />
            
            <EmptyStatisticsCard title="المشاريع" description="لا يوجد بيانات" />

            <EmptyStatisticsCard title="الفواتير" description="لا يوجد بيانات" />
        </div>
    );
}