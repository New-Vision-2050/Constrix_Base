import HorizontalSwitch from "@/modules/projects/settings/components/horizontal-switch";
import { useState } from "react";

const items = [
  {
    label: "الرقم المرجعي",
    value: "reference-number",
  },
  {
    label: "اسم المشروع",
    value: "project-name",
  },
  {
    label: "المفصل",
    value: "detailed",
  },
  {
    label: "المهندس المسؤول",
    value: "responsible-engineer",
  },
  {
    label: "رقم العقد",
    value: "contract-number",
  },
  {
    label: "نوع العقد",
    value: "contract-type",
  },
  {
    label: "مركز التكلفة",
    value: "cost-center",
  },
  {
    label: "قيمة المشروع",
    value: "project-value",
  },
  {
    label: "تاريخ البدء",
    value: "start-date",
  },
  {
    label: "نسبة الانجاز",
    value: "completion-percentage",
  },
];

function DetailsView() {
  const [activeList, setActiveList] = useState<string[]>([]);

  return (
    <div className="w-full">
      {items.map((item) => (
        <HorizontalSwitch
          key={item.value}
          checked={activeList.includes(item.value)}
          onChange={(checked) => {
            if (checked) {
              setActiveList([...activeList, item.value]);
            } else {
              setActiveList(activeList.filter((i) => i !== item.value));
            }
          }}
          label={item.label}
        />
      ))}
    </div>
  );
}

export default DetailsView;
