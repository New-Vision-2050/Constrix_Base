"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function VATTable() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-foreground text-xl font-medium">
          إعدادات القيمة المضافة
        </h3>
        <Button>
          <Plus className="w-4 h-4 ml-2" />
          إضافة
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b ">
              <th className="text-right p-4 text-gray-400 font-medium">
                الدولة
              </th>
              <th className="text-right p-4 text-gray-400 font-medium">
                الرقم الضريبي
              </th>
              <th className="text-right p-4 text-gray-400 font-medium">
                نسبة الضريبة
              </th>
              <th className="text-right p-4 text-gray-400 font-medium">
                تفعيل
              </th>
              <th className="text-right p-4 text-gray-400 font-medium">
                إجراء
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2].map((item) => (
              <tr key={item} className="border-b">
                <td className="p-4 text-foreground">مصر</td>
                <td className="p-4 text-foreground">265-365-254</td>
                <td className="p-4 text-foreground">14%</td>
                <td className="p-4">
                  <Switch defaultChecked />
                </td>
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-foreground"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>عرض</DropdownMenuItem>
                      <DropdownMenuItem>تعديل</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
