import BackpackIcon from "@/public/icons/backpack";
import CalendarRangeIcon from "@/public/icons/calendar-range";
import MapPinIcon from "@/public/icons/map-pin";
import { useTranslations } from "next-intl";
import { ProfileSubItem } from "..";

type PropsT = {
  loading: boolean;
  name?: string;
  address?: string;
  job_title?: string;
  branch?: string;
  date_appointment?: string;
  subItems?: ProfileSubItem[];
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
  const { loading, name, branch, job_title, address, date_appointment, subItems } = props;

  // handle loading state
  if (loading)
    return (
      <div className="w-full h-44 bg-gray-200 animate-pulse rounded-lg"></div>
    );

  return (
    <div className="flex flex-col items-center justify-center md:justify-around md:items-start gap-4 w-full">
      <h2 className="text-xl font-bold">{name}</h2>
      <div className="flex flex-wrap gap-4 text-gray-600">
        {subItems?.filter((item) => Boolean(item.value))?.map((item, index) => (
          <div className="flex items-center gap-2" key={`sub-item-${index}`}>
            {item.icon}
            <div className="flex flex-col">
              {item.label && <span className="text-sm font-semibold">{item.label ?? "-"}</span>}
              <span className="font-medium dark:text-white">
                {item.value ?? "--"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
