import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/table/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { OrgChartNode } from "@/types/organization";
import {
  DropdownButton,
  DropdownItemT,
} from "@/components/shared/dropdown-button";

interface NodeDetailsRowProps {
  node: OrgChartNode;
  depth: number;
  isExpanded: boolean;
  DropDownMenu?: (node: OrgChartNode) => DropdownItemT[];
}

const NodeDetailsRow: React.FC<NodeDetailsRowProps> = ({
  node,
  depth,
  isExpanded,
  DropDownMenu,
}) => {
  if (!isExpanded) return null;
  return (
    <div className="flex items-center">
      <div style={{ width: `${depth * 24}px` }} className="flex-shrink-0" />
      <div className="overflow-auto flex-1 mb-3 border-[1px] rounded-lg shadow shadow-[#1415212E] border-[#141521]">
        <Table className=" ">
          <TableHeader className="bg-sidebar">
            <TableRow>
              <TableHead className="p-3 py-4 rtl:text-right">
                إسم الإدارة
              </TableHead>
              <TableHead className="p-3 py-4 rtl:text-right">
                وصف الإدارة
              </TableHead>
              <TableHead className="p-3 py-4 rtl:text-right">
                مدير الإدارة
              </TableHead>
              <TableHead className="p-3 py-4 rtl:text-right">
                عدد الادارات الفرعية
              </TableHead>
              <TableHead className="p-3 py-4 rtl:text-right">
                عدد الفروع
              </TableHead>
              <TableHead className="p-3 py-4 rtl:text-right">
                عدد الموظفين
              </TableHead>
              <TableHead className="p-3 py-4 rtl:text-right">
                الحالة
              </TableHead>
              <TableHead className="p-3 py-4 ltr:text-right">
                الاعدادات
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-sidebar/70 border-t border-dashed">
              <TableCell className="p-3 py-4">{node.name || "N/A"}</TableCell>
              <TableCell className="p-3 py-4">
                {node.description || "N/A"}
              </TableCell>
              <TableCell className="p-3 py-4">
                {node.manager?.name || "N/A"}
              </TableCell>
              <TableCell className="p-3 py-4">
                {node.management_count || "0"}
              </TableCell>
              <TableCell className="p-3 py-4">
                {node.branch_count || "0"}
              </TableCell>
              <TableCell className="p-3 py-4">
                {node.user_count || "0"}
              </TableCell>
              <TableCell className="p-3 py-4">
                {" "}
                نشط
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
                  <DropdownButton
                    triggerButton={
                      <Button variant="outline" size="sm">
                        إجراء
                        <ChevronDown className="h-4 w-4 mr-1" />
                      </Button>
                    }
                    items={DropDownMenu ? DropDownMenu(node) : []}
                  />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default NodeDetailsRow;
