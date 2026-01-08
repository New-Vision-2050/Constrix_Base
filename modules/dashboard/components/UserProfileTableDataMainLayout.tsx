import { Button } from "@/components/ui/button";
import EyeIcon from "@/public/icons/eye-icon";
import { redirect } from "@i18n/navigation";

type PropsT = {
  title: string;
  enableRedirect?: boolean;
  redirectUrl?: string;
} & React.PropsWithChildren;

export default function UserProfileTableDataMainLayout({
  children,
  title,
  enableRedirect,
  redirectUrl,
}: PropsT) {
  const handleRedirectToUserActivity = () => {
    redirect(redirectUrl || "/activities-logs");
  };

  return (
    <div className="bg-sidebar shadow-md rounded-lg p-4">
      <div className="flex items-center justify-between gap-3 border-b pb-3 mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        {enableRedirect && (
          <Button variant="outline" onClick={handleRedirectToUserActivity}>
            <EyeIcon />
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
