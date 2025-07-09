import React from 'react';
import { Tooltip } from 'react-leaflet';
import { AttendanceRecord } from '../../constants/static-data';
import { useTranslations } from 'next-intl';

interface EmployeeTooltipProps {
  employee: AttendanceRecord;
}

const EmployeeTooltip: React.FC<EmployeeTooltipProps> = ({ employee }) => {
  const t = useTranslations('AttendanceDepartureModule.Map.tooltip');
  return (
    <Tooltip
      direction="right"
      offset={[190, -21]}
      className="transparent-tooltip"
    >
      <div
        className=" bg-[#8785A2] text-white p-3 rounded-lg shadow-lg  font-sans w-auto"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
      >
        <p>
          <span className="font-bold text-black">{t('employee')}</span> {employee.name}
        </p>
        <p className="mt-1">
          <span className="font-bold text-black">{t('branch')}</span> {employee.branch}
        </p>
        <p className="mt-1">
          <span className="font-bold text-black">{t('department')}</span>{" "}
          {employee.department}
        </p>
        <div className="mt-3 pt-2 border-t border-gray-500/50">
          <div className="flex justify-between items-center">
            <span className="font-bold text-black">
              {t('lastSeen')}
            </span>
            <span className="font-mono text-sm">
              {employee.date}
            </span>
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

export default EmployeeTooltip;
