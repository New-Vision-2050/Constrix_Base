import InfoIcon from "@/public/icons/InfoIcon";

type PropsT = {
  title: string;
  description?: string;
};
export default function EmptyStatisticsCard({ title, description }: PropsT) {
  return (
    <div className="min-w-[265px] h-[135px] bg-sidebar flex flex-col justify-between rounded-md p-3">
      <div className="w-full flex items-center justify-between px-1">
        <p>{title}</p>
        <InfoIcon additionClass="text-orange-400" />
      </div>
      <div className="flex-grow flex items-center justify-center">
        <p className="text-gray-500">{description ?? "لا يوجد بيانات"}</p>
      </div>
    </div>
  );
}
