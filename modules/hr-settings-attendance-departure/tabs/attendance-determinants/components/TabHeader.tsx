import { Button } from "@/components/ui/button";
import { useAttendanceDeterminants } from "../context/AttendanceDeterminantsContext";
import { SheetFormBuilder } from "@/modules/form-builder";
import { createDeterminantFormConfig } from "./CreateDeterminant/CreateDeterminantFormConfig";

export default function TabHeader() {
  const { showAllDeterminants, activeDeterminant } =
    useAttendanceDeterminants();

  return (
    <div className="flex items-center justify-between w-full mb-4">
      <h2 className="text-xl font-bold">
        {showAllDeterminants ? "جميع المحددات" : activeDeterminant?.location}
      </h2>
      <div className="flex gap-2">
        <SheetFormBuilder
          config={createDeterminantFormConfig}
          trigger={<Button>إنشاء محدد</Button>}
        />
      </div>
    </div>
  );
}
