import EyeIcon from "@/public/icons/eye-icon";

type PropsT = { title: string } & React.PropsWithChildren;

export default function UserProfileTableDataMainLayout({
  children,
  title,
}: PropsT) {
  return (
    <div className="bg-sidebar shadow-md rounded-lg p-4">
      <div className="flex items-center justify-between gap-3 border-b pb-3 mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <EyeIcon />
      </div>
      {children}
    </div>
  );
}
