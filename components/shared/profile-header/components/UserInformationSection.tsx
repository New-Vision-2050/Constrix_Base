import BackpackIcon from "@/public/icons/backpack";
import CalendarRangeIcon from "@/public/icons/calendar-range";
import MapPinIcon from "@/public/icons/map-pin";

type PropsT = {
  loading: boolean;
  name?: string;
  address?: string;
  job_title?: string;
  date_appointment?: string;
};
/**
 * UserProfileHeaderUserInformationSection Component
 *
 * - **Responsible for** displaying user-related information.
 *
 */
export default function UserProfileHeaderUserInformationSection(props: PropsT) {
  const { loading, name, job_title, address, date_appointment } = props;

  // handle loading state
  if (loading)
    return (
      <div className="w-full h-44 bg-gray-200 animate-pulse rounded-lg"></div>
    );

  return (
    <div className="flex flex-col items-center justify-center md:justify-around md:items-start gap-4 w-full">
      <h2 className="text-xl font-bold">{name}</h2>
      <div className="flex flex-wrap gap-4 text-gray-600">
        {job_title && (
          <div className="flex items-center gap-2">
            <BackpackIcon />
            <span className="font-medium">{job_title ?? "job title"}</span>
          </div>
        )}
        {address && (
          <div className="flex items-center gap-2">
            <MapPinIcon />
            <span className="font-medium">{address ?? "user address"}</span>
          </div>
        )}
        {date_appointment && (
          <div className="flex items-center gap-2">
            <CalendarRangeIcon />
            <div className="flex flex-col">
              <span className="font-small">تاريخ التعيين</span>
              <span className="font-medium">{date_appointment}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
