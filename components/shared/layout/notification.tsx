import { Button } from "@/components/ui/button";
import NotificationIcon from "@/public/icons/notification";

const Notification = () => {
  return (
    <Button size={"icon"} variant={"ghost"}>
      <NotificationIcon />
    </Button>
  );
};

export default Notification;
