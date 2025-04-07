import InfoIcon from "@/public/icons/InfoIcon";
import SettingsIcon from "@/public/icons/settings";
import { Button } from "@/components/ui/button";

type PropsT = {
  title: string;
  children: React.ReactNode;
};
export default function UserInformationCardLayout({ title, children }: PropsT) {
  const handleRedirectToUserProfile = () => {};
  
  return (
    <div className="w-full flex gap-4 flex-col p-4 bg-sidebar rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <InfoIcon additionClass="text-orange-400" />
          <p className="font-bold text-lg">{title}</p>
        </div>
        <Button variant="ghost" onClick={handleRedirectToUserProfile}>
          <SettingsIcon additionalClass="cursor-pointer" />
        </Button>
      </div>
      <div className="flex-grow">{children}</div>
    </div>
  );
}
