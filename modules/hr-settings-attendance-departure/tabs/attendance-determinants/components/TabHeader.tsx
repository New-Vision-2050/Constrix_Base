import { Button } from "@/components/ui/button";
import { useAttendanceDeterminants } from "../context/AttendanceDeterminantsContext";
import { SheetFormBuilder } from "@/modules/form-builder";
import { getDynamicDeterminantFormConfig } from "./CreateDeterminant/CreateDeterminantFormConfig";
import { useTranslations } from "next-intl";
import React from "react";
import { useTheme } from "next-themes";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

interface TabHeaderProps {
  title: string;
}

const TabHeader: React.FC<TabHeaderProps> = ({ title }) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";

  const textColor = isDarkMode ? "text-white" : "text-gray-900";

  const { activeConstraint, refetchConstraints, branchesData } =
    useAttendanceDeterminants();
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants"
  );

  return (
    <div className="flex items-center justify-between w-full mb-4">
      <h2 className={`${textColor} text-xl font-bold`}>
        {!activeConstraint
          ? t("allDeterminants")
          : activeConstraint?.constraint_name}
      </h2>
      <div className="flex gap-2">
        <Can check={[PERMISSIONS.attendance.settings.create]}>
          <SheetFormBuilder
            config={getDynamicDeterminantFormConfig({
              refetchConstraints,
              branchesData,
              t,
            })}
            trigger={<Button>{t("createDeterminant")}</Button>}
          />
        </Can>
      </div>
    </div>
  );
};

export default TabHeader;
