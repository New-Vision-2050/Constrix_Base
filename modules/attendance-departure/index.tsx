'use client';

import React, { useState } from 'react';
import AttendanceDateSelector from "./components/AttendanceDateSelector";
import AttendanceDepartureTable from "./components/AttendanceDepartureTable/AttendanceDepartureTable";
import AttendanceDepartureSearchFilter from "./components/AttendanceDepartureSearchFilter";
import AttendanceMap from './components/map/AttendanceMap';
import { Button } from '@/components/ui/button';

export default function AttendanceDepartureIndex() {
  const [view, setView] = useState('table'); // 'table' or 'map'

  return (
    <div className="flex flex-col gap-4 container px-6">
      <div className='flex justify-between items-center'>
        <AttendanceDateSelector />
        <Button onClick={() => setView(view === 'table' ? 'map' : 'table')}>
          {view === 'table' ? 'عرض الخريطة' : 'عرض الجدول'}
        </Button>
      </div>
      
      {view === 'table' && <AttendanceDepartureSearchFilter />}
      
      {view === 'table' ? (
        <AttendanceDepartureTable />
      ) : (
        <AttendanceMap />
      )}
    </div>
  );
}
