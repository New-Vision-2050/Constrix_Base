import ExperiencesList from "./ExperiencesList";

export default function UserExperiences() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-gray-700">الخبرات</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          إضافة خبرة
        </button>
      </div>
      {/* experience list */}
      <ExperiencesList />
    </div>
  );
}
