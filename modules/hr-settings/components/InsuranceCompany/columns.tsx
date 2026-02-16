"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ChevronDown } from "lucide-react";
import { MedicalInsuranceRow } from "./types";

interface ColumnsProps {
  onEdit: (row: MedicalInsuranceRow) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export function createColumns({ onEdit, onDelete, canEdit, canDelete }: ColumnsProps) {
  const t = useTranslations("hr-settings.insurance");

  return [
    {
      key: "name",
      name: t("name"),
      sortable: true,
      render: (row: MedicalInsuranceRow) => {
        return <strong className="text-sm">{row.name}</strong>;
      },
    },
    {
      key: "policy_number",
      name: t("policyNumber"),
      sortable: true,
      render: (row: MedicalInsuranceRow) => {
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {row.policy_number}
          </span>
        );
      },
    },
    {
      key: "employee_name",
      name: t("employee"),
      sortable: true,
      render: (row: MedicalInsuranceRow) => {
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {row.employee?.name || row.employee_name || row.employee_id}
          </span>
        );
      },
    },
    {
      key: "status",
      name: t("status"),
      sortable: false,
      render: (row: MedicalInsuranceRow) => {
        const isActive = row.status === 1;
        return (
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">{isActive ? t("active") : t("inactive")}</span>
          </div>
        );
      },
    },
    {
      key: "actions",
      name: t("actions"),
      sortable: false,
      render: (row: MedicalInsuranceRow) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              {t("action")}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canEdit && (
              <DropdownMenuItem onClick={() => onEdit(row)}>
                <Edit className="mr-2 h-4 w-4" />
                {t("edit")}
              </DropdownMenuItem>
            )}
            {canEdit && canDelete && <DropdownMenuSeparator />}
            {canDelete && (
              <DropdownMenuItem onClick={() => onDelete(row.id)} className="text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                {t("delete")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
