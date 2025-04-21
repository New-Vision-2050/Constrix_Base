import { useUserDashboardCxt } from "@/modules/dashboard/context/user-dashboard-cxt";
import BackpackIcon from "@/public/icons/backpack";
import CalendarRangeIcon from "@/public/icons/calendar-range";
import MapPinIcon from "@/public/icons/map-pin";

/**
 * UserProfileHeaderUserInformationSection Component
 *
 * - **Responsible for** displaying user-related information.
 *
 */
export default function UserProfileHeaderUserInformationSection() {
  const { user, isLoading, userPersonalData } = useUserDashboardCxt();

  // handle loading state
  if (isLoading)
    return (
      <div className="w-full h-44 bg-gray-200 animate-pulse rounded-lg"></div>
    );

  return (
    <div className="flex flex-col items-center justify-center md:justify-around md:items-start gap-4 w-full">
      <h2 className="text-xl font-bold">
        {userPersonalData?.is_default == 1
          ? userPersonalData?.nickname
          : userPersonalData?.name}
      </h2>
      <div className="flex flex-wrap gap-4 text-gray-600">
        {user?.job_title && (
          <div className="flex items-center gap-2">
            <BackpackIcon />
            <span className="font-medium">
              {user?.job_title ?? "job title"}
            </span>
          </div>
        )}
        {user?.address && (
          <div className="flex items-center gap-2">
            <MapPinIcon />
            <span className="font-medium">
              {user?.address ?? "user address"}
            </span>
          </div>
        )}
        {user?.date_appointment && (
          <div className="flex items-center gap-2">
            <CalendarRangeIcon />
            <div className="flex flex-col">
              <span className="font-small">تاريخ التعيين</span>
              <span className="font-medium">{user?.date_appointment}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
