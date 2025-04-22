import { useState } from "react";
import AddNewExperienceDialog from "./AddNewExperienceDialog";
import ExperiencesList from "./ExperiencesList";

export default function UserExperiences() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-gray-700">الخبرات</p>
        <button
          onClick={() => {
            setOpen(true);
          }}
          className="bg-pink-500 text-white px-4 py-2 rounded"
        >
          إضافة خبرة
        </button>
      </div>
      <AddNewExperienceDialog open={open} setOpen={setOpen} />
      {/* experience list */}
      <ExperiencesList />
    </div>
  );
}
