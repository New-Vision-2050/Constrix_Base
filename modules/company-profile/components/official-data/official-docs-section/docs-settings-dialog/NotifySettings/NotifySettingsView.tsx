import NotifyErrorCase from "./ErrorCase";
import NotifySettingsForm from "./FormContent";
import LoadingCase from "./LoadingCase";
import { useNotifySettings } from "./useNotifySettings";

export default function NotifySettingsView() {
  const {
    data: notifySettings,
    isLoading,
    isError,
    refetch,
  } = useNotifySettings();

  // Loading state
  if (isLoading) return <LoadingCase />;

  // Error state
  if (isError) {
    return (
      <NotifyErrorCase
        refetch={() => {
          refetch();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full p-4">
      <NotifySettingsForm
        notifySettings={notifySettings}
        onSuccessFn={() => {
          refetch();
        }}
      />
    </div>
  );
}
