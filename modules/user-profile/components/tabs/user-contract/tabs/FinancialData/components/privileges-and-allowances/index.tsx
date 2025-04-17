import { AddNewPrivilege } from "./AddNewPrivilege";

export default function PrivilegesAndAllowances() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold">الامتيازات و البدلات</p>
        <AddNewPrivilege />
      </div>
    </div>
  );
}
