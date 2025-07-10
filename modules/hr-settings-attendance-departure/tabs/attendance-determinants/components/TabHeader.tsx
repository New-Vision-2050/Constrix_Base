import { Button } from "@/components/ui/button";
import { useAttendanceDeterminants } from "../context/AttendanceDeterminantsContext";
import { SheetFormBuilder } from "@/modules/form-builder";
import { getDynamicDeterminantFormConfig } from "./CreateDeterminant/CreateDeterminantFormConfig";

export default function TabHeader() {
  const { activeConstraint, refetchConstraints, branchesData } = useAttendanceDeterminants();

  console.log('branchesData-branchesData', branchesData)
  return (
    <div className="flex items-center justify-between w-full mb-4">
      <h2 className="text-xl font-bold">
        {!activeConstraint ? "جميع المحددات" : activeConstraint?.constraint_name}
      </h2>
      <div className="flex gap-2">
        <SheetFormBuilder
          config={getDynamicDeterminantFormConfig({ refetchConstraints, branchesData })}
          trigger={<Button>إنشاء محدد</Button>}
        />
      </div>
    </div>
  );
}
