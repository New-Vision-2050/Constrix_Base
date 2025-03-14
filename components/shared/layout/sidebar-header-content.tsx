import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import NewVision from "@/public/icons/new-vision";
import React from "react";
import { AvatarGroup } from "../avatar-group";

const SidebarHeaderContent = () => {
  const { open } = useSidebar();

  return (
    <>
      <div className="flex items-center justify-center flex-col gap-1">
        <NewVision
          width={open ? 60 : 30}
          height={47}
          className="transition-[width] ease-linear duration-200"
        />
        <p
          className={cn(
            "transition truncate font-bold",
            open ? "opacity-100" : "opacity-0"
          )}
        >
          نيو فيجن
        </p>
      </div>
      <div
        className={cn(
          "transition-[padding] flex gap-5 my-5 ",
          open ? "pr-5" : "pr-1 "
        )}
      >
        <AvatarGroup
          fullName="Mohamed Saad"
          alt="Mohamed Saad"
          src="https://github.com/shad\cn.png"
        />
        <p
          className={cn(
            "transition truncate",
            open ? "opacity-100" : "opacity-0"
          )}
        >
          مرحبا، محمد سعد!
        </p>
      </div>
    </>
  );
};

export default SidebarHeaderContent;
