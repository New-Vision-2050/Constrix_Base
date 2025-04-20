import React from "react";

interface UserActivity {
  user: string;
  action: string;
  date: string;
  id: string;
}

interface UserActivityLogProps {
  activities: UserActivity[];
  className?: string;
}

const UserActivityLog = ({
  activities,
  className = "",
}: UserActivityLogProps) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-sidebar text-start">
            <th className="p-4 text-start font-medium">المستخدم</th>
            <th className="p-4 text-start font-medium">الاجراء</th>
            <th className="p-4 text-start font-medium">التاريخ</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index} className="border-b border-gray-700">
              <td className="p-4 text-start">{activity.user}</td>
              <td className="p-4 text-start">{activity.action}</td>
              <td className="p-4 text-start">
                {new Date(activity.date).toLocaleDateString("en-GB")}{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserActivityLog;
