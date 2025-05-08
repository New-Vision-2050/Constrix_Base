import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronDown, List, Trees } from 'lucide-react'
import { OrgChartNode } from '@/types/organization'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useLocale } from 'next-intl'

interface NodeDetailsRowProps {
  node: OrgChartNode;
  depth: number;
  isExpanded: boolean;
}

const NodeDetailsRow: React.FC<NodeDetailsRowProps> = ({ node, depth, isExpanded }) => {
  if (!isExpanded) return null
  const locale = useLocale()
  return (
    <div className="flex items-center">
      <div style={{ width: `${depth * 24}px` }} className="flex-shrink-0"/>
      <div className="overflow-auto flex-1 mb-3 border-[1px] rounded-lg shadow shadow-[#1415212E] border-[#141521]">
        <Table className=" ">
          <TableHeader className="bg-[#18003A]">
            <TableRow>
              <TableHead className="p-3 py-4 rtl:text-right text-[#EAEAFF]/87">إسم الإدارة</TableHead>
              <TableHead className="p-3 py-4 rtl:text-right text-[#EAEAFF]/87">وصف الإدارة</TableHead>
              <TableHead className="p-3 py-4 rtl:text-right text-[#EAEAFF]/87">مدير الإدارة</TableHead>
              <TableHead className="p-3 py-4 rtl:text-right text-[#EAEAFF]/87">عدد الادارات الفرعية</TableHead>
              <TableHead className="p-3 py-4 rtl:text-right text-[#EAEAFF]/87">عدد الفروع</TableHead>
              <TableHead className="p-3 py-4 rtl:text-right text-[#EAEAFF]/87">عدد الموظفين</TableHead>
              <TableHead className="p-3 py-4 rtl:text-right text-[#EAEAFF]/87">الحالة</TableHead>
              <TableHead className="p-3 py-4 ltr:text-right text-[#EAEAFF]/87">الاعدادات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-[#140F35] border-t border-dashed">
              <TableCell className="p-3 py-4">{node.name || 'N/A'}</TableCell>
              <TableCell className="p-3 py-4">{node.description || 'N/A'}</TableCell>
              <TableCell className="p-3 py-4">{node.manager?.name || 'N/A'}</TableCell>
              <TableCell className="p-3 py-4">{node.management_count || '0'}</TableCell>
              <TableCell className="p-3 py-4">{node.branch_count || '0'}</TableCell>
              <TableCell className="p-3 py-4">{node.user_count || '0'}</TableCell>
              <TableCell className="p-3 py-4"> نشط
                {/*<label className="switch">*/}
                {/*  <input*/}
                {/*    checked={node?.status === 1}*/}
                {/*    type="checkbox"*/}
                {/*  />*/}
                {/*  <span className="slider"></span>*/}
                {/*</label>*/}
              </TableCell>
              <TableCell className="p-3 py-4">
                <div className="flex justify-end gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        إجراء
                        <ChevronDown className="h-4 w-4 mr-1"/>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={locale === 'ar' ? 'start' : 'end'}>
                      <DropdownMenuItem>
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default NodeDetailsRow
