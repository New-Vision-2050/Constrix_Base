import PermissionItem from "./permission-item";

const dummyList = [
  "عرض كروت الداشبورد",
  "انشاء مشروع",
  "تصدير",
  "تخصيص اعمدة",
  "استكمال بيانات",
];


export default function PermissionsList() {
  return (
    <tbody>
      {dummyList?.map((item) => (
        <PermissionItem item={item} key={item} />
      ))}
    </tbody>
  );
}
