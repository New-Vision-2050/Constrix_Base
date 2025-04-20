import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type IPlanCard = {
  currentUsers: number;
  maxUsers: number;
  price: number;
  daysLeft: number;
  storageLimit: string;
};

const PlanCard = ({
  currentUsers,
  maxUsers,
  price,
  daysLeft,
  storageLimit,
}: IPlanCard) => {
  const usagePercent = Math.round((currentUsers / maxUsers) * 100);

  return (
    <div className="bg-sidebar border border-primary bg-plan-card rounded-lg p-4  ml-4 flex flex-col justify-between shrink-0">
      <div className="flex items-center justify-end mb-2">
        <Badge
          variant="secondary"
          className="text-xs px-2 py-0.5 text-primary bg-sidebar"
        >
          فضية
        </Badge>
      </div>

      <div className="flex items-start gap-4">
        <div className="text-lg">
          <p className="text-primary">
            <sup>SR</sup> {price}
          </p>
          <p>شهر</p>
        </div>

        <ul className="text-sm text-muted-foreground leading-6 mb-3 pr-4 list-disc list-inside">
          <li>{currentUsers} مستخدمين</li>
          <li>سعة تخزين تصل إلى {storageLimit}</li>
          <li>دعم افتراضي</li>
        </ul>
      </div>

      <div className="mb-3">
        <div className="flex justify-between mb-1 text-foreground">
          <span>الأيام</span>
          <span className="text-muted-foreground">{usagePercent}%</span>
        </div>
        <Progress value={usagePercent} />
        <span className="text-muted-foreground text-xs">{daysLeft} أيام متبقية</span>

      </div>

      <Button className="w-full mt-2">تطوير الباقة</Button>
    </div>
  );
};

export default PlanCard;
