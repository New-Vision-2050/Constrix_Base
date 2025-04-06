import { CalendarDays, MapPin, AlertCircle } from "lucide-react";
import CompanyLogo from "./company-logo";

type CompanyHeaderProps = {
  companyName: string;
  joinDate: string;
  showBranches?: boolean;
  showLocation?: boolean;
};

const CompanyHeader = ({
  companyName,
  joinDate,
  showBranches = true,
  showLocation = true,
}: CompanyHeaderProps) => {
  return (
    <div className="bg-sidebar rounded-lg w-full flex items-center justify-between p-4">
      <CompanyLogo />

      <div className="flex flex-col text-right w-full pr-6">
        <h2 className="text-2xl font-bold mb-4">{companyName}</h2>

        <div className="flex gap-8 text-sm">
          {showLocation && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-foreground/70" />
            </div>
          )}

          {showBranches && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span>الفروع</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-foreground/70" />
            <div className="leading-tight">
              <div className="text-xs">تاريخ الانضمام</div>
              <div className="font-bold text-base">{joinDate}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;
