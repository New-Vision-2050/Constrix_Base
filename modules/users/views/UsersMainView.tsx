import CreateBuilderModule from "@/features/create-builder";
import RecivedUserDataDialog from "../components/set-user/retrieved-user-data";

export default function UsersMainView() {
  return (
    <>
      <CreateBuilderModule btnLabel="أنشاء مستخدم" moduleId={"create-user"} />
      <RecivedUserDataDialog />
    </>
  );
}
