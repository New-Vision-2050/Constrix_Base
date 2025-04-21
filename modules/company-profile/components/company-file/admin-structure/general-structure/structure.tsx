import React from "react";

interface Branch {
  id: string;
  name: string;
}

interface Level {
  id: string;
  branches: Branch[];
}

const Structure = () => {
  const levels: Level[] = [
    {
      id: "level1",
      branches: [{ id: "riyadh", name: "فرع الرياض" }],
    },
    {
      id: "level2",
      branches: [
        { id: "jeddah", name: "فرع جدة" },
        { id: "cairo", name: "فرع القاهرة" },
        { id: "mecca", name: "فرع مكة" },
      ],
    },
    {
      id: "level3",
      branches: [{ id: "admin", name: "ادارة عامة" }],
    },
    {
      id: "level4",
      branches: [
        { id: "committee", name: "لجنة" },
        { id: "department", name: "قسم" },
      ],
    },
  ];

  return (
    <div className="w-full h-full flex items-center justify-start flex-col gap-5 pt-5">
      {/*  {levels.map((level) => (
        <div key={level.id} className="flex items-start gap-5">
          {level.branches.map((branch) => (
            <div key={branch.id}>{branch.name}</div>
          ))}
        </div>
      ))}*/}
      General Structure
    </div>
  );
};

export default Structure;
