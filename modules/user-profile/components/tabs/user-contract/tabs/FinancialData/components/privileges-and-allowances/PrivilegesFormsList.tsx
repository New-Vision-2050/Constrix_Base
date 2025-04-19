import { useFinancialDataCxt } from "../../context/financialDataCxt";
import PrivilegeItem from "./components/privilege-item";

export default function PrivilegesFormsList() {
  const { addedPrivilegesList } = useFinancialDataCxt();

  return (
    <div className="flex flex-col gap-8">
      {addedPrivilegesList &&
        addedPrivilegesList?.map((item) => (
          <PrivilegeItem privilegeData={item} key={item?.id} />
        ))}
    </div>
  );
}
