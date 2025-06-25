'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { staticBranches, staticDepartments, staticApprovers } from '../constants/static-data';

const AttendanceDepartureSearchFilter: React.FC = () => {
  return (
    <div className="p-4 bg-[#140F35] rounded-lg mb-4">
      <h3 className="text-white mb-4 text-right font-medium">فلتر البحث</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input 
          placeholder="الاسم/البريد الالكتروني/رقم الجوال" 
          className="bg-transparent text-white border-gray-600 border-1 rounded-md w-full ring-1 h-full ring-gray-600 focus:ring-gray-400 focus:border-purple-500 placeholder:text-gray-400"
        />
        
        <Select dir="rtl">
          <SelectTrigger className="bg-transparent text-white border-gray-600 focus:border-purple-500">
            <SelectValue placeholder="المحدد المعتمد" />
          </SelectTrigger>
          <SelectContent>
            {staticApprovers.map(approver => (
              <SelectItem key={approver.value} value={approver.value}>{approver.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select dir="rtl">
          <SelectTrigger className="bg-transparent text-white border-gray-600 focus:border-purple-500">
            <SelectValue placeholder="الإدارة" />
          </SelectTrigger>
          <SelectContent>
            {staticDepartments.map(department => (
              <SelectItem key={department.value} value={department.value}>{department.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select dir="rtl">
          <SelectTrigger className="bg-transparent text-white border-gray-600 focus:border-purple-500">
            <SelectValue placeholder="الفرع" />
          </SelectTrigger>
          <SelectContent>
            {staticBranches.map(branch => (
              <SelectItem key={branch.value} value={branch.value}>{branch.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AttendanceDepartureSearchFilter;
