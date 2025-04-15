import UserCoursesList from "./UserCoursesList";

export default function UserCourses() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-gray-700">الخبرات</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          اضافة حقل اخر
        </button>
      </div>
      {/* courses list */}
      <UserCoursesList />
    </div>
  );
}
