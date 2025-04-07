'use client'
import { TableBuilder } from "@/modules/table";
import UserProfileTableDataMainLayout from "../../UserProfileTableDataMainLayout";
import { UserProjectsTableConfig } from "./table-config";
import ExportButton from "@/modules/table/components/ExportButton";

export default function UserProjectsData() {
  const tableConfig = UserProjectsTableConfig();
  return (
    <UserProfileTableDataMainLayout title="المشاريع">
      <div className="flex gap-4 flex-col">
        <TableBuilder
          config={tableConfig}
          searchBarActions={
            <div className="flex items-center gap-3">
              <ExportButton data={[]} />
            </div>
          }
        />
      </div>
    </UserProfileTableDataMainLayout>
  );
}
