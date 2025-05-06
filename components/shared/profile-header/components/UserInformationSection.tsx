import BackpackIcon from "@/public/icons/backpack";
import CalendarRangeIcon from "@/public/icons/calendar-range";
import MapPinIcon from "@/public/icons/map-pin";
import { useTranslations } from "next-intl";

type PropsT = {
  loading: boolean;
  name?: string;
  address?: string;
  job_title?: string;
  branch?: string;
  date_appointment?: string;
};
/**
 * UserProfileHeaderUserInformationSection Component
 *
 * - **Responsible for** displaying user-related information.
 *
 */
export default function UserProfileHeaderUserInformationSection(props: PropsT) {
  // declare and define vars and state
  const t = useTranslations("UserProfile.header.placeholder");
  const { loading, name, branch, job_title, address, date_appointment } = props;

  // handle loading state
  if (loading)
    return (
      <div className="w-full h-44 bg-gray-200 animate-pulse rounded-lg"></div>
    );

  return (
    <div className="flex flex-col items-center justify-center md:justify-around md:items-start gap-4 w-full">
      <h2 className="text-xl font-bold">{name}</h2>
      <div className="flex flex-wrap gap-4 text-gray-600">
        {branch && (
          <div className="flex items-center gap-2">
            <MapPinIcon />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{t("branch")}</span>
              <span className="font-medium dark:text-white">
                {branch ?? "--"}
              </span>
            </div>
          </div>
        )}
        {job_title && (
          <div className="flex items-center gap-2">
            <BackpackIcon />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{t("jobTitle")}</span>
              <span className="font-medium dark:text-white">
                {job_title ?? "--"}
              </span>
            </div>
          </div>
        )}
        {address && (
          <div className="flex items-center gap-2">
            <MapPinIcon />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{t("address")}</span>
              <span className="font-medium dark:text-white">
                {address ?? "--"}
              </span>
            </div>
          </div>
        )}
        {date_appointment && (
          <div className="flex items-center gap-2">
            <CalendarRangeIcon />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">
                {t("appointmentDate")}
              </span>
              <span className="font-medium dark:text-white">
                {date_appointment ?? "--"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
