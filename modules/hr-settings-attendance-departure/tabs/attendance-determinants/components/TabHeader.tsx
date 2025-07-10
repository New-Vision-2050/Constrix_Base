import { Button } from "@/components/ui/button";
import { useAttendanceDeterminants } from "../context/AttendanceDeterminantsContext";
import { SheetFormBuilder } from "@/modules/form-builder";
import { getDynamicDeterminantFormConfig } from "./CreateDeterminant/CreateDeterminantFormConfig";
import { useTranslations } from "next-intl";

export default function TabHeader() {
  const { activeConstraint, refetchConstraints, branchesData } = useAttendanceDeterminants();
  // استخدام hook الترجمة
  const t = useTranslations("HRSettingsAttendanceDepartureModule.attendanceDeterminants");
  
  return (
    <div className="flex items-center justify-between w-full mb-4">
      <h2 className="text-xl font-bold">
        {!activeConstraint ? t('allDeterminants') : activeConstraint?.constraint_name}
      </h2>
      <div className="flex gap-2">
        <SheetFormBuilder
          config={getDynamicDeterminantFormConfig({ 
            refetchConstraints, 
            branchesData,
            t: (key: string) => t(key) // إرسال دالة الترجمة للفورم
          })}
          trigger={<Button>{t('createDeterminant')}</Button>}
        />
      </div>
    </div>
  );
}
