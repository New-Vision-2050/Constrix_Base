import React from 'react';
import { Tooltip } from 'react-leaflet';
import { AttendanceRecord } from '../../constants/static-data';

interface EmployeeTooltipProps {
  employee: AttendanceRecord;
}

const EmployeeTooltip: React.FC<EmployeeTooltipProps> = ({ employee }) => {
  return (
    <Tooltip
      direction="right"
      offset={[190, -21]}
      className="transparent-tooltip"
    >
      <div
        className=" bg-[#8785A2] text-white p-3 rounded-lg shadow-lg text-right font-sans w-auto"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
      >
        <p>
          <span className="font-bold text-black">الموظف:</span> {employee.name}
        </p>
        <p className="mt-1">
          <span className="font-bold text-black">الفرع:</span> {employee.branch}
        </p>
        <p className="mt-1">
          <span className="font-bold text-black">الإدارة:</span>{" "}
          {employee.department}
        </p>
        <div className="mt-3 pt-2 border-t border-gray-500/50">
          <div className="flex justify-between items-center">
            <span className="font-bold text-black">
              آخر
              <br />
              ظهور:
            </span>
            <span className="font-mono text-sm">
              {employee.date}
              <br />
              10:14:06
            </span>
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

export default EmployeeTooltip;
