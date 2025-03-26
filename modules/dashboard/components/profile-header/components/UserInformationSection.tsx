import BackpackIcon from "@/public/icons/backpack";
import CalendarRangeIcon from "@/public/icons/calendar-range";
import MapPinIcon from "@/public/icons/map-pin";

const dummyData = {
  fullName: "Sallam Rady",
  designation: "Software Engineer",
  designationIcon: "ri-code-s-slash-line",
  location: "Sohag, EG",
  joiningDate: "Nov 1999",
};

/**
 * UserProfileHeaderUserInformationSection Component
 *
 * - **Responsible for** displaying user-related information.
 * 
 */

export default function UserProfileHeaderUserInformationSection() {
  return (
    <div className="flex flex-col items-center justify-center md:justify-around md:items-start gap-4 w-full">
      <h2 className="text-xl font-bold">{dummyData?.fullName}</h2>
      <div className="flex flex-wrap gap-4 text-gray-600">
        {dummyData?.designation && (
          <div className="flex items-center gap-2">
            <BackpackIcon />
            <span className="font-medium">{dummyData?.designation}</span>
          </div>
        )}
        {dummyData?.location && (
          <div className="flex items-center gap-2">
            <MapPinIcon />
            <span className="font-medium">{dummyData?.location}</span>
          </div>
        )}
        {dummyData?.joiningDate && (
          <div className="flex items-center gap-2">
            <CalendarRangeIcon />
            <div className="flex flex-col">
              <span className="font-small">تاريخ التعيين</span>
              <span className="font-medium">{dummyData?.joiningDate}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
