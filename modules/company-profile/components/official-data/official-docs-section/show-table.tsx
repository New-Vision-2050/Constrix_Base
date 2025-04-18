import React from "react";

interface UserActivity {
  user: string;
  action: string;
  date: string;
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
              <td className="p-4 text-start">{activity.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UserActivityLogExample = () => {
  const activitiesData = [
    {
      user: "محمد خالد حسن",
      action: "قام بتحديث التاريخ",
      date: "20/10/2024 08:00م",
    },
    {
      user: "عمرو احمد",
      action: "قام بحذف المرفق",
      date: "20/10/2024 08:00م",
    },
    {
      user: "خالد احمد",
      action: "حاول الحذف",
      date: "20/10/2024 08:00م",
    },
  ];

  return (
    <div className="p-4">
      <UserActivityLog activities={activitiesData} />
    </div>
  );
};

export default UserActivityLogExample;
