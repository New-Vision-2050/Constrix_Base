import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";

const Notification = () => {
  return (
    <Button size={"icon"} variant={"ghost"}>
      <BellIcon />
    </Button>
  );
};

export default Notification;
